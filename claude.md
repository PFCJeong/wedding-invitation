# Docker 이미지 AWS EC2 배포 가이드

## 목차
1. [사전 준비](#사전-준비)
2. [SSH 연결 설정](#ssh-연결-설정)
3. [EC2에 Docker 설치](#ec2에-docker-설치)
4. [Docker 이미지 빌드 및 전송](#docker-이미지-빌드-및-전송)
5. [EC2에서 컨테이너 실행](#ec2에서-컨테이너-실행)
6. [Route 53 도메인 연결](#route-53-도메인-연결)
7. [유용한 관리 명령어](#유용한-관리-명령어)

---

## 사전 준비

### 필요한 정보
- **EC2 인스턴스 퍼블릭 IP**: `3.104.119.97`
- **SSH 키 파일 경로**: `/Users/jon.snow/Downloads/wonsiksein.pem`
- **EC2 사용자 이름**: `ec2-user` (Amazon Linux의 기본 사용자)
- **도메인**: `wonsik-se.in`

### 로컬 환경 요구사항
- Docker 설치
- AWS CLI 설치 (선택사항, Route 53 설정용)
- SSH 클라이언트

---

## SSH 연결 설정

### 1. SSH 키 파일 권한 설정

```bash
chmod 400 /Users/jon.snow/Downloads/wonsiksein.pem
```

### 2. SSH 연결 테스트

```bash
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97
```

성공하면 EC2 인스턴스에 접속됩니다.

### 3. SSH 연결 끊기

```bash
exit
```

---

## EC2에 Docker 설치

### 1. EC2에 SSH 접속 후 Docker 설치

```bash
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97 << 'EOF'
# 시스템 업데이트
sudo yum update -y

# Docker 설치
sudo yum install -y docker

# Docker 서비스 시작
sudo systemctl start docker

# 부팅 시 Docker 자동 시작 설정
sudo systemctl enable docker

# 현재 사용자를 docker 그룹에 추가 (sudo 없이 docker 명령 사용 가능)
sudo usermod -a -G docker ec2-user

# Docker 버전 확인
docker --version
EOF
```

**참고**: `usermod` 명령 후 변경사항을 적용하려면 SSH를 재접속해야 합니다.

---

## Docker 이미지 빌드 및 전송

### 1. 로컬에서 Docker 이미지 빌드

프로젝트 루트 디렉토리에서:

```bash
docker build -t wedding-invitation:latest .
```

### 2. Docker 이미지를 tar.gz 파일로 저장

```bash
docker save wedding-invitation:latest | gzip > wedding-invitation.tar.gz
```

파일 크기 확인:
```bash
ls -lh wedding-invitation.tar.gz
# 결과: 약 47MB
```

### 3. SCP로 EC2에 이미지 전송

```bash
scp -i "/Users/jon.snow/Downloads/wonsiksein.pem" \
    wedding-invitation.tar.gz \
    ec2-user@3.104.119.97:~/
```

---

## EC2에서 컨테이너 실행

### 1. EC2에 SSH 접속하여 이미지 로드 및 실행

```bash
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97 << 'EOF'
# Docker 이미지 로드
gunzip -c wedding-invitation.tar.gz | docker load

# 이미지 확인
docker images

# 기존 컨테이너 중지 및 제거 (있다면)
docker stop wedding-app 2>/dev/null || true
docker rm wedding-app 2>/dev/null || true

# 컨테이너 실행
# -d: 백그라운드 실행
# -p 80:80: 호스트의 80 포트를 컨테이너의 80 포트로 매핑
# --name: 컨테이너 이름 지정
# --restart unless-stopped: 컨테이너 자동 재시작 설정
docker run -d -p 80:80 \
    --name wedding-app \
    --restart unless-stopped \
    wedding-invitation:latest

# 컨테이너 상태 확인
docker ps
EOF
```

### 2. 웹사이트 접속 확인

```bash
curl -I http://3.104.119.97
```

HTTP 200 응답이 오면 성공!

---

## Route 53 도메인 연결

### 1. 호스팅 영역 생성

```bash
aws route53 create-hosted-zone \
    --name wonsik-se.in \
    --caller-reference "$(date +%s)" \
    --hosted-zone-config Comment="Wedding invitation site"
```

생성된 네임서버 정보:
```
ns-1426.awsdns-50.org
ns-801.awsdns-36.net
ns-1700.awsdns-20.co.uk
ns-28.awsdns-03.com
```

### 2. A 레코드 생성

`route53-change.json` 파일 생성:

**중요**: Route 53에서는 도메인 이름 끝에 반드시 마침표(.)를 붙여야 합니다!

```json
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "wonsik-se.in.",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "3.104.119.97"
          }
        ]
      }
    },
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "www.wonsik-se.in.",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "3.104.119.97"
          }
        ]
      }
    }
  ]
}
```

A 레코드 적용:

```bash
aws route53 change-resource-record-sets \
    --hosted-zone-id Z055383528R4MCBKV0AUD \
    --change-batch file://route53-change.json
```

### 3. 도메인 네임서버 설정

**중요**: AWS Route 53 콘솔에서 네임서버 확인 및 변경

1. https://console.aws.amazon.com/route53/ 접속
2. 왼쪽 메뉴에서 **"Registered domains"** 클릭
3. **wonsik-se.in** 클릭
4. **"Name servers"** 섹션에서 다음 네임서버로 설정:
   ```
   ns-1426.awsdns-50.org
   ns-801.awsdns-36.net
   ns-1700.awsdns-20.co.uk
   ns-28.awsdns-03.com
   ```

### 4. DNS 전파 확인

DNS 전파에는 5분~48시간이 걸릴 수 있습니다.

확인 방법:
```bash
# 호스팅 영역의 A 레코드 확인
aws route53 list-resource-record-sets \
    --hosted-zone-id Z055383528R4MCBKV0AUD \
    --query "ResourceRecordSets[?Type=='A']"

# DNS 조회 (전파 후)
nslookup wonsik-se.in
```

### 5. 웹사이트 접속

DNS가 전파된 후:
- **http://wonsik-se.in**
- **http://www.wonsik-se.in**

---

## 유용한 관리 명령어

### EC2 접속

```bash
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97
```

### Docker 컨테이너 관리

```bash
# 컨테이너 로그 확인
docker logs wedding-app

# 컨테이너 로그 실시간 보기
docker logs -f wedding-app

# 컨테이너 상태 확인
docker ps

# 모든 컨테이너 확인 (중지된 것 포함)
docker ps -a

# 컨테이너 재시작
docker restart wedding-app

# 컨테이너 중지
docker stop wedding-app

# 컨테이너 시작
docker start wedding-app

# 컨테이너 삭제
docker rm wedding-app

# 컨테이너 내부 접속 (디버깅용)
docker exec -it wedding-app sh
```

### 새 버전 배포

```bash
# 1. 로컬에서 새 이미지 빌드
docker build -t wedding-invitation:latest .

# 2. 이미지를 tar.gz로 저장
docker save wedding-invitation:latest | gzip > wedding-invitation.tar.gz

# 3. EC2로 전송
scp -i "/Users/jon.snow/Downloads/wonsiksein.pem" \
    wedding-invitation.tar.gz \
    ec2-user@3.104.119.97:~/

# 4. EC2에서 업데이트
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97 << 'EOF'
# 기존 컨테이너 중지 및 제거
docker stop wedding-app
docker rm wedding-app

# 기존 이미지 제거 (선택사항)
docker rmi wedding-invitation:latest

# 새 이미지 로드
gunzip -c wedding-invitation.tar.gz | docker load

# 새 컨테이너 실행
docker run -d -p 80:80 \
    --name wedding-app \
    --restart unless-stopped \
    wedding-invitation:latest

# 확인
docker ps
EOF
```

### Docker 이미지 관리

```bash
# 이미지 목록 확인
docker images

# 사용하지 않는 이미지 정리
docker image prune

# 특정 이미지 삭제
docker rmi wedding-invitation:latest
```

### 시스템 리소스 확인

```bash
# EC2에서 실행
# 메모리 사용량
free -h

# 디스크 사용량
df -h

# CPU 및 메모리 사용량 (top)
top

# Docker 리소스 사용량
docker stats wedding-app
```

---

## 보안 그룹 설정

### EC2 보안 그룹에서 포트 80 열기

AWS 콘솔에서 수동 설정:

1. https://console.aws.amazon.com/ec2/ 접속
2. 리전 선택: **Asia Pacific (Sydney)**
3. 왼쪽 메뉴에서 **"Instances"** 클릭
4. IP `3.104.119.97`인 인스턴스 선택
5. **"Security"** 탭 → Security groups 링크 클릭
6. **"Inbound rules"** 탭 → **"Edit inbound rules"** 클릭
7. **"Add rule"** 클릭:
   - Type: **HTTP**
   - Protocol: **TCP**
   - Port range: **80**
   - Source: **0.0.0.0/0** (모든 IP) 또는 **My IP** (본인 IP만)
8. **"Save rules"** 클릭

---

## 트러블슈팅

### 1. SSH 연결 실패

```bash
# 키 파일 권한 확인
ls -l /Users/jon.snow/Downloads/wonsiksein.pem
# -r-------- 이어야 함

# 권한 재설정
chmod 400 /Users/jon.snow/Downloads/wonsiksein.pem
```

### 2. Docker 명령어 권한 오류

```bash
# ec2-user를 docker 그룹에 추가 후 SSH 재접속
sudo usermod -a -G docker ec2-user
exit
# 다시 SSH 접속
```

### 3. 웹사이트 접속 안 됨

```bash
# 컨테이너 실행 확인
docker ps

# 컨테이너 로그 확인
docker logs wedding-app

# 포트 확인
sudo netstat -tulpn | grep :80

# EC2 보안 그룹에서 포트 80이 열려있는지 확인
```

### 4. DNS가 작동하지 않음

```bash
# Route 53 레코드 확인
aws route53 list-resource-record-sets \
    --hosted-zone-id Z055383528R4MCBKV0AUD

# 도메인 등록 정보에서 네임서버 확인
# AWS 콘솔 → Route 53 → Registered domains
```

---

## 참고 정보

### 파일 구조

```
wedding-invitation/
├── Dockerfile              # Docker 이미지 빌드 설정
├── .dockerignore          # Docker 빌드시 제외할 파일
├── package.json           # Node.js 의존성
├── config-overrides.js    # Webpack 설정 오버라이드
├── route53-change.json    # Route 53 A 레코드 설정
└── src/                   # 소스 코드
```

### Dockerfile 내용

```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### .dockerignore 내용

```
node_modules
npm-debug.log
build
.git
.gitignore
README.md
.env
.DS_Store
```

---

## 비용 절감 팁

### 1. EC2 인스턴스 중지

사용하지 않을 때 인스턴스를 중지하여 비용 절감:

```bash
# AWS CLI로 인스턴스 중지
aws ec2 stop-instances --instance-ids i-xxxxxxxxx --region ap-southeast-2

# 인스턴스 시작
aws ec2 start-instances --instance-ids i-xxxxxxxxx --region ap-southeast-2
```

**주의**: 인스턴스 중지 시 퍼블릭 IP가 변경될 수 있습니다. Elastic IP를 할당하여 고정 IP 사용을 권장합니다.

### 2. Docker Hub 사용 (선택사항)

이미지를 매번 전송하는 대신 Docker Hub에 푸시:

```bash
# Docker Hub 로그인
docker login

# 이미지 태그
docker tag wedding-invitation:latest your-username/wedding-invitation:latest

# Docker Hub에 푸시
docker push your-username/wedding-invitation:latest

# EC2에서 pull
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97 \
    "docker pull your-username/wedding-invitation:latest"
```

---

## SSL/HTTPS 설정 (Let's Encrypt)

### 1. EC2에 Certbot 설치

```bash
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97 << 'EOF'
# Certbot 설치
sudo yum install -y certbot

# 인증서 저장 디렉토리 생성
sudo mkdir -p /etc/letsencrypt
sudo chmod 755 /etc/letsencrypt

# Certbot 버전 확인
certbot --version
EOF
```

### 2. SSL 인증서 발급

**중요**: 인증서 발급 전에 기존 컨테이너를 중지하여 포트 80을 비워야 합니다.

```bash
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97 << 'EOF'
# 기존 컨테이너 중지
docker stop wedding-app

# SSL 인증서 발급 (standalone 모드)
# 이메일은 본인의 이메일로 변경하세요
sudo certbot certonly --standalone \
  -d wonsik-se.in \
  --non-interactive \
  --agree-tos \
  --email wonsiksein@gmail.com \
  --preferred-challenges http

# 인증서 파일 확인
sudo ls -la /etc/letsencrypt/live/wonsik-se.in/
EOF
```

**참고**: DNS가 전파되지 않은 경우 `www.wonsik-se.in`은 추가할 수 없습니다. DNS 전파 후 인증서를 확장할 수 있습니다.

### 3. Nginx SSL 설정 파일 생성

로컬에서 `nginx-ssl.conf` 파일 생성:

```nginx
server {
    listen 80;
    server_name wonsik-se.in www.wonsik-se.in;

    # HTTP를 HTTPS로 리다이렉트
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name wonsik-se.in www.wonsik-se.in;

    # SSL 인증서 경로
    ssl_certificate /etc/letsencrypt/live/wonsik-se.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wonsik-se.in/privkey.pem;

    # SSL 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 정적 파일 경로
    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

### 4. Dockerfile 수정

기존 Dockerfile을 수정하여 SSL 설정 포함:

```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx SSL configuration
COPY nginx-ssl.conf /etc/nginx/conf.d/default.conf

# Expose ports 80 and 443
EXPOSE 80
EXPOSE 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 5. Docker 이미지 재빌드 및 배포

```bash
# 1. 로컬에서 이미지 재빌드
docker build -t wedding-invitation:latest .

# 2. 이미지를 tar.gz로 저장
docker save wedding-invitation:latest | gzip > wedding-invitation-ssl.tar.gz

# 3. EC2로 전송
scp -i "/Users/jon.snow/Downloads/wonsiksein.pem" \
    wedding-invitation-ssl.tar.gz \
    ec2-user@3.104.119.97:~/

# 4. EC2에서 배포
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97 << 'EOF'
# 이미지 로드
gunzip -c wedding-invitation-ssl.tar.gz | docker load

# 기존 컨테이너 제거
docker rm wedding-app 2>/dev/null || true

# SSL 인증서를 마운트하여 컨테이너 실행
docker run -d \
  -p 80:80 \
  -p 443:443 \
  --name wedding-app \
  --restart unless-stopped \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  wedding-invitation:latest

# 컨테이너 상태 확인
docker ps
EOF
```

### 6. EC2 보안 그룹에 포트 443 추가

AWS 콘솔에서:

1. https://console.aws.amazon.com/ec2/ 접속
2. 리전: **Asia Pacific (Sydney)** 선택
3. 왼쪽 메뉴 **"Instances"** 클릭
4. IP `3.104.119.97` 인스턴스 선택
5. **"Security"** 탭 → Security groups 링크 클릭
6. **"Inbound rules"** 탭 → **"Edit inbound rules"** 클릭
7. **"Add rule"** 클릭:
   - Type: **HTTPS**
   - Protocol: **TCP**
   - Port range: **443**
   - Source: **0.0.0.0/0**
8. **"Save rules"** 클릭

### 7. SSL 인증서 자동 갱신 설정

Let's Encrypt 인증서는 90일마다 갱신이 필요합니다. 자동 갱신 설정:

```bash
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97 << 'EOF'
# Certbot 자동 갱신 타이머 활성화
sudo systemctl enable certbot-renew.timer
sudo systemctl start certbot-renew.timer

# 타이머 상태 확인
sudo systemctl status certbot-renew.timer

# 갱신 테스트 (실제로 갱신하지는 않고 테스트만)
sudo certbot renew --dry-run
EOF
```

### 8. HTTPS 접속 확인

```bash
# IP로 접속 테스트
curl -I https://3.104.119.97 --insecure

# 도메인으로 접속 테스트 (DNS 전파 후)
curl -I https://wonsik-se.in
```

### SSL 인증서 갱신 시 주의사항

인증서가 갱신된 후에는 Docker 컨테이너를 재시작해야 새 인증서가 적용됩니다:

```bash
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97 << 'EOF'
# 컨테이너 재시작
docker restart wedding-app
EOF
```

또는 자동 재시작을 위한 스크립트를 cron에 등록할 수 있습니다.

### www 서브도메인 추가 (DNS 전파 후)

DNS가 완전히 전파된 후 www를 포함한 인증서 재발급:

```bash
ssh -i "/Users/jon.snow/Downloads/wonsiksein.pem" ec2-user@3.104.119.97 << 'EOF'
# 기존 컨테이너 중지
docker stop wedding-app

# www 포함 인증서 재발급
sudo certbot certonly --standalone \
  -d wonsik-se.in \
  -d www.wonsik-se.in \
  --non-interactive \
  --agree-tos \
  --email wonsiksein@gmail.com \
  --preferred-challenges http \
  --expand

# 컨테이너 재시작
docker start wedding-app
EOF
```

---

## 요약

이 가이드를 통해 다음을 수행했습니다:

1. ✅ EC2에 SSH로 연결
2. ✅ EC2에 Docker 설치
3. ✅ 로컬에서 Docker 이미지 빌드
4. ✅ 이미지를 EC2로 전송
5. ✅ EC2에서 컨테이너 실행
6. ✅ Route 53으로 도메인 연결
7. ✅ DNS 설정 완료
8. ✅ Let's Encrypt SSL/TLS 인증서 발급
9. ✅ HTTPS 설정 및 HTTP → HTTPS 리다이렉트
10. ✅ SSL 인증서 자동 갱신 설정

**최종 결과**:
- IP 주소: https://3.104.119.97
- 도메인: https://wonsik-se.in (DNS 전파 후)
- HTTP 접속 시 자동으로 HTTPS로 리다이렉트
- SSL 인증서 자동 갱신 (90일마다)
