# Node.js 18 Alpine 이미지 사용 (경량화)
FROM node:18-alpine

# 필요한 시스템 패키지 설치 (보안 업데이트 포함)
RUN apk update && apk upgrade && \
    apk add --no-cache \
    curl \
    dumb-init && \
    rm -rf /var/cache/apk/*

# 비특권 사용자 생성 (보안 강화)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일들 복사 (캐시 최적화)
COPY package*.json ./

# 의존성 설치 (프로덕션 전용)
RUN npm ci --only=production && \
    npm cache clean --force

# 소스 코드 복사
COPY . .

# uploads 디렉토리 생성 및 권한 설정
RUN mkdir -p uploads && \
    chown -R nodejs:nodejs /app

# 비특권 사용자로 전환
USER nodejs

# 포트 노출
EXPOSE 5002

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=5002

# 헬스체크 추가 (Kubernetes에서는 주로 사용하지 않지만 Docker 환경에서 유용)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5002/ || exit 1

# dumb-init을 사용하여 신호 처리 개선 (Kubernetes 환경에서 중요)
ENTRYPOINT ["dumb-init", "--"]

# 애플리케이션 실행
CMD ["node", "server.js"]