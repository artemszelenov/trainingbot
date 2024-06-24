run:
	@go run main.go serve

binary:
	env GOOS=linux GOARCH=amd64 go build -o ./bin