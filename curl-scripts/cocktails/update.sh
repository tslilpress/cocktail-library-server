#!/bin/bash

API="http://localhost:4741"
URL_PATH="/cocktails"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
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
