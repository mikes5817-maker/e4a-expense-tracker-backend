#!/bin/bash
echo "Running migrations..."
npx prisma migrate deploy
echo "Starting app with ts-node..."
node -r tsconfig-paths/register -r ts-node/register src/main.ts
