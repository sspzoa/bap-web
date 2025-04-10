FROM oven/bun:latest
WORKDIR /app

RUN apt-get update && apt-get install -y tzdata
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY package.json ./
RUN bun install

COPY . .
RUN bun run build

CMD [ "bun", "start" ]