FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "NEXT_PUBLIC_API_URL=$API_URL" > /app/.env.local' >> /app/start.sh && \
    echo 'yarn build' >> /app/start.sh && \
    echo 'yarn start' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]