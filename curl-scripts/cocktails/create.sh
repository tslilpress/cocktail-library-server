#!/bin/bash

API="http://localhost:4741"
URL_PATH="/cocktails"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "cocktail": {
      "name": "'"${NAME}"'",
      "preparation": "'"${PREP}"'",
      "serveIn": "'"${SERVEIN}"'",
      "howToServe": "'"${HOWTOSERVE}"'",
      "owner": "'"${OWNER}"'",
      "note": "'"${NOTE}"'",
    }
  }'

echo