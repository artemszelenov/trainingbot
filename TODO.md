1. ~~проверить возможность вытаскивать телефон~~ (Делается отдельным запросом)
2. ~~Отмена~~
3. Удаление у всех

caddy config

```
example.com {
    request_body {
        max_size 10MB
    }
    reverse_proxy 127.0.0.1:8090 {
        transport http {
            read_timeout 360s
        }
    }
}
```
