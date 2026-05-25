#!/bin/bash
echo "Running migrations..."
npx prisma migrate deploy
echo "Building app..."
yarn build
echo "Starting app..."
node dist/main
