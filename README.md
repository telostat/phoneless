# phoneless

HTTP API interface to Google's [libphonenumber](https://github.com/google/libphonenumber).

> **TODO:** Provide full README.

## Quickstart

Run the Docker image:

```sh
docker run --rm -p 3001:3001 telostat/phoneless:latest
```

Then, issue a query:

```sh
curl -s "http://localhost:3001/validate?p=%2B12165551234"
```

This will give the following (formatted) output:

```json
{
  "valid": true,
  "details": {
    "region": "US",
    "type": {
      "number": 2,
      "code": "FIXED_LINE_OR_MOBILE",
      "text": "fixed line or mobile"
    },
    "input": "+12165551234",
    "formatted": {
      "e164": "+12165551234",
      "national": "(216) 555-1234",
      "international": "+1 216-555-1234",
      "rfc3966": "tel:+1-216-555-1234"
    }
  }
}
```

## Docker Images

See [Docker Repository](https://hub.docker.com/repository/docker/telostat/phoneless).

## License

Copyright 2021 Telostat Pte Ltd.

This work is licensed under the MIT license. See [LICENSE](./LICENSE) file.
