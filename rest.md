---
layout: doc
title: Rest API
---

A REST API da BRE Coins não funciona em tempo real e possui funcionamento limitado, se comparado à [WebSocket API](/socketio). Entretanto, fornece uma forma simplificada de acesso às informações públicas da plataforma.

Todas as solicitações são realizadas contra o seguinte servidor:

> https://backend.brecoins.com.br

As solicitações podem partir de qualquer domínio, mesmo via AJAX do lado do cliente, pois o cabeçalho `Access-Control-Allow-Origin` (CORS) está definido como `*`. Por este mesmo motivo, JSONP não está disponível. Não é necessário autenticação. O retorno é dado em JSON.

Há um limite de 7 solicitações por segundo. Caso sua aplicação necessite realizar mais solicitações, por favor, utilize a [WebSocket API](/socketio).


# Ticker

Esta API fornece informações de *tickeriing* a partir de um request HTTP.

**Request**

> /api/v1/BTC-BRL/ticker

Exemplo de resposta:

```json
{
	"last": X,
	"open": X,
	"bid": X,
	"ask": X,
	"high": X,
	"low": X,
	"vol_crypto": X,
	"vol_fiat": X
}
```

Onde:

* **last**: cotação da última negociação
* **open**: preço de abertura do período de 24 horas
* **bid**: melhor oferta
* **ask**: melhor pedida
* **high**: alta do período de 24 horas
* **low**: baixa do período de 24 horas
* **vol_crypto**: volume em criptomoeda negociado
* **vol_fiat**: volume em fiduciária negociado


# Livro de Ofertas

Esta API fornece a obtenção, em um *array JSON*, das negociações do livro de ofertas, ordenada da mais vantajosa para a menos vantajosa.

Os resultados estão limitados a 1000.

**Request**

> /api/v1/BTC-BRL/offerbook

Exemplo de resposta:

```json
[
	{
		"nick": X,
		"amount_crypto": X,
		"amount_fiat": X,
		"crypto_price_min": X,
		"crypto_price_max": X,
		"type": X
		
	},
	...
]
```

Onde:

* **nick**: Identificação do usuário (nome aleatório de uma capital ou centro financeiro seguido de um conjunto único de letras e números)
* **amount_crypto**: Quantidade de criptomoeda que carrega a ordem, caso esta seja uma ordem de venda. A cada negociação parcial, o valor negociado é deduzido deste item.
* **amount_fiat**: Quantidade de fiduciária que carrega a ordem, caso esta seja uma ordem de compra. A cada negociação parcial, o valor negociado é deduzido deste item.
* **crypto_price_min**: Cotação mínima (em ordens de compra)
* **crypto_price_max**: Cotação máxima (em ordens de venda)
* **type**: "buy" se esta for uma ordem de compra ou "sell" se for uma ordem de venda

É válido notar que, ao passo que a API anterior retornou um objeto dotado de propriedades, esta API retorna um vetor dotado de objetos, tendo em vista que seu propósito é retornar múltiplos dados estruturados.

# Últimas Negociações

Informações sobre as últimas negociações (parciais ou completas) ocorridas na plataforma podem ser obtidas por meio desta API.

Esta API retorna apenas os dados referentes às últimas 24 horas. Os dados são retornados em um *array JSON*.

**Request**

> /api/v1/BTC-BRL/transactions

Exemplo de resposta:

```json
[
	{
		"timestamp": X,
		"price": X,
		"amount": X
	},
	...
]
```

Onde:

* **timestamp**: Data e hora da negociação, no formato "YYYY-MM-DD HH:II:SS". Não é um Unix Timestamp.
* **price**: Cotação
* **amount_crypto**: Volume da negociação, em criptomoeda
* **amount_fiat**: Volume da negociação, em fiduciária


# Histórico

Esta API oferece um histórico consolidado de todas as negociações, desde o início das operações desta plataforma, no formato de 5 (cinco) *arrays JSON* em um objeto JSON.

Não é possível obter cada negociação, individualmente. O histórico é obtido em porções de tempo de 4 horas.

**Request**

> /api/v1/BTC-BRL/history

Exemplo de resposta:

```json
{
	"date":  [X, Y, Z, ...],
	"high":  [X, Y, Z, ...],
	"low":   [X, Y, Z, ...],
	"open":  [X, Y, Z, ...],
	"close": [X, Y, Z, ...]
}
```

Onde:

* **date**: fornece a data de abertura de uma porção de tempo, no formato "YYYY-MM-DD HH:II:SS". A data de fechamento pode ser calculada adicionando-se a este período 3 horas, 59 minutos e 59 segundos
* **high**: fornece a alta de uma porção de tempo
* **low**: fornece a baixa de uma porção de tempo
* **open**: fornece o preço de abertura de uma porção de tempo
* **close**: fornece o preço de fechamento de uma porção de tempo

Os 5 vetores retornados são sincronicamente iteráveis. Isto significa que a ordem dos itens no vetor importa. Para obter as informações da primeira porção de tempo, por exemplo, basta ler o primeiro item de todos os vetores.
