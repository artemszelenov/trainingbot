run:
	@templ generate
	@go run cmd/main.go serve

html:
	@templ generate

build-server:
	env GOOS=linux GOARCH=amd64 go build -o ./bin