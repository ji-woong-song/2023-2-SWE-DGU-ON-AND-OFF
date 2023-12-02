#!/usr/bin/env bash

PROJECT_ROOT="/home/ubuntu/app"
JAR_FILE="$PROJECT_ROOT/spring-webapp.jar"
ENV_FILE="$PROJECT_ROOT/.env"

APP_LOG="$PROJECT_ROOT/application.log"
ERROR_LOG="$PROJECT_ROOT/error.log"
DEPLOY_LOG="$PROJECT_ROOT/deploy.log"

TIME_NOW=$(date +%c)
# env 파일 적용
source $ENV_FILE
# build 파일 복사
echo "$TIME_NOW > $JAR_FILE 파일 복사" >> $DEPLOY_LOG
cp $PROJECT_ROOT/build/libs/*.jar $JAR_FILE

# jar 파일 실행
echo "$TIME_NOW > $JAR_FILE 파일 실행" >> $DEPLOY_LOG
# .env 파일이 존재하는지 확인
if [ -f "$ENV_FILE" ]; then
  # .env 파일이 존재하면 모든 환경 변수를 -D 옵션에 추가
  nohup java $(cat "$ENV_FILE" | xargs -I {} echo -n "-D{} ") -jar $JAR_FILE  > $APP_LOG 2> $ERROR_LOG &
else
  # .env 파일이 없으면 그냥 .jar 파일 실행
  echo "env파일 없음!\n"
fi

CURRENT_PID=$(pgrep -f $JAR_FILE)
echo "$TIME_NOW > 실행된 프로세스 아이디 $CURRENT_PID 입니다." >> $DEPLOY_LOG
