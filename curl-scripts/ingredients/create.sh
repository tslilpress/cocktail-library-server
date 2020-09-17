#!/bin/bash

API="http://localhost:4741"
URL_PATH="/ingredients"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "ingredient": {
      "title": "'"${TITLE}"'",
      "unit": "'"${UNIT}"'"
    }
  }'

echo
