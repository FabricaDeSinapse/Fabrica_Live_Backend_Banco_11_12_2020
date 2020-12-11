# Backend REST API

Protocolo de comunicação (que é como a gente troca ideia): HTTP ou HTTPS
IP: localhost ou 127.0.0.1
Porta: 3000

URI: http://localhost:3000/
Rota ou Endpoint: /

Posso criar novos caminhos dentro da mesma URL
Em um site, novos caminhos geralmente levam a páginas diferentes

URI: http://localhost:3000/hello

Rota ou Endpoint: /hello

Todas as requisições possuem VERBOS


REST: Verbos específicos para as requisições
RESTful: Uma aplicação (API) capaz de se comunicar com verbos REST


[GET] http://localhost:3000/hello
[POST] http://localhost:3000/hello

GET -> Obter informações
POST -> Criar informações novas
PUT -> Atualizar informações já existentes
DELETE -> Remover informações já existentes

Também posso enviar um corpo da requisição

Toda requisição possui duas coisas:
URL
HEADER
BODY

[POST] http://localhost:3000/mensagem
Body:
{"mensagem": "Texto da mensagem"}

JSON -> JavaScript Object Notation
