---
layout: doc
title: Algotrading
---

Robôs acessam o servidor WebSocket da plataforma de forma simplificada.

Possuem como vantagem o fato de já estarem inseridos na interface da plataforma, o que os torna de extrema facilidade para execução.

Esta documentação 

**Nota**: NUNCA execute robôs cuja procedência você desconhece. Robôs podem tomar qualquer ação em sua conta, inclusive realizar saques de fundos.

**Nota 2**: Este é um recurso para usuários avançados. O uso de robôs cujo algoritmo não é conhecido por completo pode levar à tomada de decisões inesperadas e acarretar em perda de fundos. Não nos responsabilizamos por movimentos inesperados de robôs, que são de total responsabilidade de seus autores. A BRE Coins não desenvolve ou possui robôs oficiais, limitando-se apenas a disponibilizar o meio dos mesmos serem executados.

# Execução de Robôs

Os códigos de robôs são executados em loop, e não encerram seu funcionamento a menos que finalizem sua execução. Desta forma, você pode utilizar intervalos e esperar por eventos emitidos pelo servidor.

Toda a sua lógica deve ser escrita em Javascript (ECMAScript 5) nativo. Se você utiliza algum outro subset de Javascript (TypeScript, CoffeeScript, Flow, ReasonML etc.), ou mesmo uma versão mais recente e ainda não amplamente suportada de Javascript (ES6/7/8 ou propostas TC39), certifique-se de transpilar o código para ES5, anteriormente, ou que o navegador onde você utilizará sua conta tenha suporte ao seu subset.

Seu robô **não** possui ao DOM da página, ou a variáveis da aplicação front-end padrão.

# Comunicação com o backend

A comunicação com o servidor é realizada de duas formas: emitindo e aguardando eventos.

## Emitindo eventos

Para enviar mensagens ao servidor, utilize:

```javascript
application.remote.socketio_emit(mensagem, argumentos)
```

Em "mensagem", defina o conjunto "subsistema.método" que deseja executar. Em "argumentos", envie o argumento solicitado pela documentação.

## Aguardando eventos

Para receber eventos, você precisa escutá-los com antecedência, definindo uma função *callback* que será chamada quando tais eventos forem lançados. Veja:

```javascript
application.remote.socketio_on(evento, callback)
```

Por exemplos:

```javascript
application.remote.socketio_on('ticker', function(tickerinfo) {
	application.remote.alert(tickerinfo.last);
});
```

## Eventos disponíveis

Todos os eventos da API WebSocket estão disponíveis, e a forma de uso é similar. [Clique aqui](/socketio) para ler a documentação do backend.

# Debugging

Algumas ferramentas de debugging estão disponíveis:

## Console

Você pode utilizar `console.log()` e `console.error()` para ter suas mensagens escritas no Console Javascript das Ferramentas de Desenvolvedor do navegador do usuário.

## alert

Você pode invocar caixas de diálogo da seguinte forma:

```javascript
application.remote.alert("Mensagem");
```

# Finalizando a execução

Para interromper a execução de seu robô a partir de seu próprio código (sem intervenção do usuário necessária para que clique no botão "Parar"), basta chamar:

```javascript
application.disconnect();
```
