---
layout: doc
title: Socket.IO API
---

# Introdução

Esta é a documentação da API WebSocket da BRE Coins.

Por meio dela, você conseguirá usufruir de todos os recursos que estariam disponíveis em um acesso direto ao *home broker*.

É válido ressaltar que nossa aplicação *home broker* é uma aplicação completamente estática, desenvolvida em Javascript e hospedada no [GitHub Pages](https://pages.github.com/), fazendo uso desta API. Por este motivo, caso você enfrente alguma dúvida no processo de implementação de seu aplicativo que consome esta API, sinta-se à vontade para analisar nosso código-fonte por meio do repositório oficial, [clicando aqui](https://github.com/BRECoins/plataforma/blob/master/assets/scripts/app.js).

## Socket.IO

Esta API não utiliza e não é compatível com implementações cruas (*raw*) de websockets, tal qual a API de WebSockets padrão dos navegadores. 

Os servidores *back-end* da BRE Coins aceitam requisições que sigam o padrão da biblioteca [Socket.IO](https://socket.io), porém o único método de transporte aceito é o WebSocket.

Nossos servidores *back-end* fazem uso do [µWS](https://github.com/uNetworking/uWebSockets), uma implementação de WebSockets desenvolvida em C++ e patrocinada pelas empresas BitMex, Bitfinex e Coinbase.

## Convenções utilizadas nesta API

Esta API não utiliza valores decimais (*float*, *double*, *decimal* etc), apenas valores inteiros (*int*). Desta forma, valores em bitcoins são escritos em satoshis e valores em reais são escritos em centavos. Por exemplo:

* 1 Bitcoin = 100000000 Satoshis
* 1.5 Bitcoin = 150000000 Satoshis
* 0.5 Bitcoin = 50000000 Satoshis
* 1 Satoshi = 0.00000001 Bitcoin
* 1 Real = 100 centavos
* 1.50 Reais = 150 centavos
* 0.50 Reais = 50 centavos
* 1 centavo = 0.01 Real

Para converter bitcoin para satoshis, multiplique o valor por 10^8. A operação inversa é a divisão por esta mesma constante. Em se tratando de reais, tal constante será 10^2.

**Data e hora:** todas as datas estão no formato YYYY-MM-DD HH:II:SS. O fuso-horário padrão é o de Brasília (America/Sao_Paulo).

Para fins de compatibilidade, nossa API não funciona utilizando *callbacks*. Ao emitir uma mensagem ao servidor que dependa de uma resposta do mesmo, obtenha, por meio desta documentação, o evento emitido pelo servidor em resposta ao método chamado e escute pelo mesmo *antes* de realizar a solicitação.

**IMPORTANTE**: Em todas as suas requisições, inclua uma variável adicional de nome "exchange" e valor inteiro 1. Caso a API esteja marcada com um 🔑, você também deverá incluir a chave de sessão (valor obtido após o login - ver [member.login](#login)), por meio da variável "sess_key".

### Formato da documentação

O título do capítulo de uma documentação indica um subsistema, e o título da documentação indica um método.

Os argumentos devem ser enviados em JSON. Não se esqueça de adicionar a variável "exchange" supracitada.

As respostas também são retornadas em JSON. Cada item do campo "resposta" indica um evento que o servidor poderá emitir, pelo qual você deve escutar. Caso haja nomes para as variáveis de retorno (em negrito), considere tais nomes como as chaves das propriedades do objeto retornado. Caso não haja nomes, considere que a resposta trará apenas o dado livre, fora de qualquer objeto ou vetor.

Por exemplo:

---

#### HelloWorld
	
Este subsistema é apenas um exemplo
	
##### Test 🔑
	
Este método é apenas um exemplo.
	
Argumentos
	
* **user_id**: ID do usuário
	
Resposta:
	
* **HelloWorldResult**
	* **name**: O nome do usuário
	* **surname**: O sobrenome do usuário
	
##### AnotherTest
	
Este é outro exemplo
	
Argumentos: ~
	
Resposta:
	
* **AnotherTestResult**
	O nome completo do usuário
	
---

Para implementar a API "Test", é necessário:

* Ouvir o evento "HelloWorldResult"
* Emitir o evento "HelloWorld.Test" com os dados:

```json
{
	"exchange": 1,
	"sess_key": X
}
```

A resposta virá como o evento "HelloWorldResult", contendo:

```json
{
	"name": "John",
	"surname": "Doe"
}
```

Da mesma forma, para utilizar a segunda API, é necessário ouvir o evento "AnotherTestResult" e, em seguida emitir o evento "HelloWorld.AnotherTest" contendo os dados:

```json
{
	"exchange": 1
}
```

A resposta virá como o evento "AnotherTestResult", apenas com:

```json
"John Doe"
```

Note que é possível que uma API retorne múltiplos eventos ou nenhum evento, ou pode retornar diferentes eventos, dependendo das circunstâncias (na documentação, estipulado com "E", em caso de eventos simultâneos, ou "OU", em caso de lançamento condicional). Esteja atento à listagem de variáveis (fazemos nova menção à variável "exchange" de valor "1") e de eventos emitidos.

## Subsistemas & Métodos

Esta API é baseada em subsistemas e métodos. Um evento emitido ao servidor é estruturado no formato `subsistema.método`. Você pode imaginar subsistemas como classes compostas apenas por métodos estáticos.

Na listagem abaixo, os títulos principais indicam os subsistemas, ao passo que os títulos secundários indicam os métodos.

Os métodos não estão dispostos em ordem de chamada, mas em ordem alfabética. Se deseja um ponto de partida, comece pelo [login](#login) ou pelo [registro](#signup).

# balance 

Este subsistema fornece meios para se verificar o saldo do usuário, além de realizar simulações de compra e venda.

## getbalance 🔑

Obtém o saldo disponível em conta do usuário.

Argumentos:

* **sess_key**: chave de sessão

Resposta:

* **balance_crypto**
	* saldo em criptomoeda
* E **balance_fiat**
	* saldo em fiduciária

## simulateMarketBuy 🔑

Simula uma ordem de compra à mercado com todo o saldo em criptomoeda do usuário.

Argumentos:

* **sess_key**: chave de sessão

Resposta:

* **simulatemarketbuy**
	* saldo estimado

## simulateMarketSell 🔑

Simula uma ordem de venda à mercado com todo o saldo em fiduciária do usuário.

Argumentos:

* **sess_key**: chave de sessão

Resposta:

* **simulatemarketSell**
	* Saldo estimado

# common

Subsistema de obtenção de informações comuns (globais) do sistema.

## get

Obtém informações comuns do sistema.

Argumentos:
	* **crypto_currency**: Nome da criptomoeda a utilizar, com inicial maiúscula (Bitcoin)
	* **fiat_currency**: Nome da moeda fiduciária a utilizar, com inicial maiúscula (Real)

Resposta:

* **common**
	* **fiat\_currency\_id**: Identificador da fiduciária a utilizar
	* **crypto\_currency\_id**: Identificador da criptomoeda a utilizar

# deposit

Esta API permite realizar depósitos de moeda fiduciária e criptomoeda.

## gennewwallet 🔑

Solicita que uma nova carteira seja gerada para o usuário. Note que endereços de carteiras não necessariamente mudam, e você pode enviar diversos depósitos para uma mesma carteira. Entretanto, se por motivo de anonimidade você deseja um novo endereço de depósito, utilize este método.

A resposta a este método não é imediata ou automática. Deve-se aguardar um tempo para que uma nova carteira seja enviada, já que estas ações não possuem prioridade em nossos servidores. Gerar uma nova carteira pode levar entre 3 a 60 segundos.

Não há resposta retornada. Apenas o efeito desta ação pode ser verificado por meio da API [deposit.list_crypto](#getwalletaddr).

Argumentos: ~

Resposta: ~

## getwalletaddr 🔑

Solicita um endereço de depósito de criptomoeda. Assim que o depósito for detectado pela rede, o mesmo é listado ([member.list_crypto](#list_crypto)). Quando o depósito for detectado, seu status se altera e o saldo é adicionado à conta do usuário.

Argumentos: ~

Resposta:

* **btcwallet**
	* Endereço da carteira

## list_crypto 🔑

Lista todos os depósitos em criptomoeda da conta, inclusive aqueles não confirmados.

Argumentos: ~

Resposta:

* **depositlist_cryptosuccess**
	* *Array* de objetos:
		* **id**: identificador interno do depósito
		* **wallet**: carteira
		* **amount**: valor
		* **status**: "pending" se pendente, ou "confirmed" (após 3 confirmações na blockchain)
		* **txid**: Transaction ID (TxID) na Blockchain
		* **created_at**: data

## list_fiat 🔑

Lista todos os depósitos em moeda fiduciária da conta, inclusive aqueles não confirmados.

Argumentos: ~

Resposta:

* **depositlist_fiatsuccess**
	* *Array* de objetos:
		* **id**: identificador interno do depósito
		* **bank**: identificador interno da conta bancária da plataforma (ver [sitebankaccs.list](#list))
		* **amount**: valor
		* **status**: "pending" se aguardando comprovante do usuário; "waitingapproval" se aguardando confirmação; "done" se finalizado; "cancelled" se cancelado; "disapproved" se recusado pela administração
		* **reason**: Motivo da recusa (se **status** é "disapproved")
		* **proof**: URL do comprovante
		* **created_at**: Data de criação
		* **updated_at**: Última atualização 

## deposit_fiat 🔑

Inicia um processo de depósito em moeda fiduciária.

Argumentos:

* **bank**: identificador interno da conta bancária da plataforma (ver [sitebankaccs.list](#list))
* **amount**: valor, em centavos
* **currency**: identificador da moeda fiduciária (ver [common.get](#get))

Resposta:

* **depositdeposit_fiatsuccess**
	* identificador interno do depósito
* OU **deposit.overlimit** se o valor estiver acima do limite diário do usuário ([veja como aumentar seus limites](https://brecoins.com.br/faq/como-aumentar-meus-limites-para-saque-e-deposito.html))
	* **limit**: limite total
	* **used**: limite utilizado

## send_receipt 🔑

Envia um depósito em formato de imagem (JPG, PNG ou GIF).

Argumentos:

* **file**: chave do arquivo no hospedeiro de arquivos (ver [upload](#upload))
* **deposit_id**: identificador interno do depósito

Resposta: ~

## cancel_fiat 🔑

Cancela um depósito em moeda fiduciária. O depósito precisa estar pendente.

Argumentos:

* **f**: identificador interno do depósito

Resposta: ~

# geo

Obtém dados geográficos estáticos.

## countrylist

Obtém uma lista de países.

Argumentos: ~

Resposta:

* **geocountrylist**
	* *Array* de objetos:
		* **id**: identificador interno do país
		* **name**: nome do país
		* **code**: código do país, de acordo com a norma ISO 3166-1 (dois caracteres)

## regionslist

Obtém uma lista de estados, regiões ou províncias, a depender do país.

Argumentos:

* **country**: identificador interno do país

Resposta:

* **georegionslist**
	* *Array* de objetos:
		* **id**: identificador interno do estado
		* **name**: nome do estado

# ledger

Fornece extrato e lista de transações do usuário.

## list 🔑

Retorna o extrato do usuário. Esta API retorna 10 resultados por página.

Argumentos:

* **page**: página do extrato (0 = lançamentos mais novos)

Resposta:

* **ledgerlist**
	* **page**: página (espelho do argumento)
	* **rows**: *Array* de objetos:
		* **description**: Descrição do movimento, em texto legível
		* **movement**: 1 para reforço, -1 para sangria
		* **amount**: valor do movimento (sempre positivo)
		* **curr_type**: "crypto" para criptomoeda, "fiat" para fiduciária
		* **curr_id**: identificador interno da moeda
		* **balance**: saldo do usuário ao final da transação
		* **created_at**: data do lançamento


## trades 🔑

Retorna a lista de negociações do usuário. Também inclui negociações contra ordens à limite e execuções parciais. Esta API retorna 10 resultados por página.

Argumentos:

* **page**: página do extrato (0 = lançamentos mais novos)

Resposta:

* **tradeslist**
	* **page**: página (espelho do argumento)
	* **rows**: *Array* de objetos:
		* **crypto**: criptomoeda envolvida
		* **fiat**: fiduciária envolvida
		* **price**: cotação negociada
		* **amount**: volume negociado
		* **time**: data da negociação
		* **buyer**: identificador interno do comprador
		* **seller**: identificador interno do vendedor

# level

Disponibiliza informações sobre o nível do usuário. Não permite upgrade (para isso, veja [userdocuments](#userdocuments)).

## getLevelsData 🔑

Disponibiliza informações sobre o nível em que o usuário se encontra e as possibilidades de upgrade.

Argumentos: ~

Resposta:

* **level.getLevelsData**

	* **max_level**: nível máximo da plataforma
	* **user_level**: nível do usuário
	* **user_level_name**: título do nível do usuário
	* **user_level_description**: descrição do nível do usuário
	* **next_level**: próximo nível disponível
	* **next_level_name**: título do próximo nível disponível
	* **next_level_description**: descrição do próximo nível disponível
	* **required_documents**: documentos necessários para subir de nível; *Array* de objetos:
		* **doccode**: identificador interno do documento
		* **docname**: nome do documento necessário

# limits

Obtém informações sobre limites do usuário ([veja como aumentar seus limites](https://brecoins.com.br/faq/como-aumentar-meus-limites-para-saque-e-deposito.html)).

## get\_user\_limits 🔑

Obtém os limites diários relacionados à moedas fiduciárias. Não existem limites para criptomoedas.

Os limites são sempre contados a partir da última meia-noite do horário de Brasília (America/Sao_Paulo).

Argumentos: ~ 

Resposta:

* **user_limits**
	* **withdraw**: limite de saque
	* **deposit**: limite de depósito

# member

Controla login, registro e outras operações relacionadas às contas de usuário.

## login

Gera uma chave de sessão. Jamais armazene as credenciais do usuário. Limite-se a armazenar a chave de sessão.

Argumentos:

* **email**: e-mail do usuário
* **password**: senha do usuário
* **browser_id**: fingerprinting do navegador, aplicativo ou robô (uma ID aleatória alfanumérica que você deve gerar e utilizá-la sempre)
* **otp_token**: se necessário (ou já enviado), token 2FA ou token enviado por e-mail
* **b64**: fotografia da face do usuário, se necessário (vide abaixo)

Resposta:

* **memberloginsuccess**
	* **sess_key**: chave da sessão
* OU **memberloginemailfail** caso o e-mail não esteja registrado
* OU **memberloginpasswordfail** caso a senha esteja incorreta
* OU **memberloginmustverify** caso o e-mail do usuário ainda não tenha sido confirmado
* OU **memberloginaccountfail** caso a conta do usuário tenha sido desativada por um administrador
* OU **memberrequestotptoken** caso um token 2FA seja requisitado
	* **wrong**: `true` caso um token já tenha sido enviado e esteja errado, `false` caso esta seja a primeira tentativa
	* **otp**: `true` caso o token seja gerado por um aplicativo como Authenticator ou Authy, `false` caso o token seja enviado por e-mail ou SMS
	* **sentby**: "phone" caso o token tenha sido enviado via SMS, "email" caso tenha sido enviado via e-mail
	* **webcam**: `true` caso o usuário tenha habilitado o reconhecimento facial, `falso` caso contrário.
	* **enablefaceerror**: erro de reconhecimento facial; Objeto:
		* **Description**: mensagem legível com o porquê da imagem não ter sido aceita
		* **Code**: código do erro 

### Notas sobre biometria

Ao receber o evento `memberrequestotptoken` com o dado `.webcam` definido como `true`,  é necessário fotografar a face do usuário, certificando-se que a face do usuário ocupa a porção central da imagem, toda a face é exibida e as condições de foco e iluminação são satisfatórias. Então, converta a imagem para base64 e a envie por meio da variável "b64" novamente ao mesmo método, junto com todos os outros dados (login, senha etc.).

Os possíveis erros são:

|Código|Descrição|
|--- |--- |
|500|Centralize o rosto na área de captura! (Face não encontrada)|
|501|Centralize o rosto na área de captura! (Face fora do padrão definido)|
|502|Aproxime o rosto da câmera! (Imagem muito pequena)|
|503|Afaste o rosto da câmera! (Imagem muito grande)|
|504|Iluminação não satisfatória! Verifique se o ambiente não está muito escuro e se a câmera não está direcionada contra uma fonte de iluminação.|
|505|Imagem embaçada ou fora de foco! Aproxime o rosto da câmera. Se ainda assim o foco estiver ruim, entre em contato com a equipe de suporte e solicite o ajuste da câmera.|
|506|Centralize o rosto na área de captura! (Face inválida)|
|507|Rosto inclinado! Mantenha o rosto reto e olhe para a câmera.|
|508|Rosto de lado! Mantenha o rosto reto e olhe para a câmera.|
|20505|O base64 infromado não é suportado. Os formatos aceitos são png, jpeg e webp|
|40002|Este cadastro possui ou está envolvido com um registro de divergência e foi enviado para a mesa de análise!|
|40003|Este cadastro possui ou está envolvido com um registro de divergência e foi enviado para a mesa de análise! Entre em contato com a matriz|
|40004|Este cadastro está em uso por outra loja. Tente novamente mais tarde|
|40005|Este cadastro não tem uma biometria cadastrada|
|50002|Este cadastro foi enviado para a fila de análise biométrica e não pode ser modificado neste momento! Aguarde alguns instantes e tente novamente.|

## checklogin

Verifica se uma chave de sessão continua válida. Útil para login permanente.

Argumentos: ~

Resposta:

* **memberloginsuccess**
	* **sess_key**: chave da sessão

## logout

Fecha uma sessão.

Argumentos: ~ 

Resposta: ~

## confirm

Confirma o e-mail de um usuário.

Argumentos:

* **token**: token numérico enviado ao e-mail do usuário (note que o usuário é indicado, separado do token por um hífen)

Resposta:

* **memberconfirmdatasuccess**: êxito
* **memberconfirmdatafail**: usuário não existe
* **memberconfirmtokenfail**: token incorreto

## signup

Cria uma conta de usuário.

Certifique-se que o usuário leu e aceitou os nossos [Termos de Uso](https://brecoins.com.br/termos) antes de prosseguir com o cadastro. Caso não haja aceite, o cadastro é proibido. Jamais armazene as credenciais do usuário. Limite-se a armazenar as chaves de sessão.

Argumentos:

* **email**: e-mail do usuário
* **password**: senha do usuário
* **region**: identificador interno do estado/região/província do usuário
* **city**: nome da cidade do usuário
* **phone**: telefone do usuário, iniciando com +, contendo DDI e DDD (o DDI brasileiro é 55)
* **fullname**: nome completo
* **cpf**: CPF do usuário
* **gender**: Gênero do usuário ("M" para masculino, "F" para feminino)

Resposta:

* **membersignupsuccess**: êxito
* **membersignup_emailfail**: e-mail já registrado

## recover

Inicia um processo de recuperação de senha.

Argumentos:

* **email**: E-mail do usuário

Resposta:

* **recover.tokensent**: êxito, token enviado
* **recover.invaliduser**: e-mail não encontrado

## recover_checktoken

Verifica um token e salva uma nova senha. Jamais armazene as credenciais do usuário. Limite-se a armazenar as chaves de sessão.

Argumentos:

* **email**: e-mail do usuário
* **token**: token
* **new_password** (opcional): nova senha

Resposta:

* **recover.tokenok**: o token está correto (caso **new_password** não tenha sido enviado)
* OU **recover.pwdok**: nova senha salva
* OU e**memberupdatedatafail**: usuário não existe

## enable_otp 🔑

Habilita o 2FA.

Argumentos:

* **password**: senha do usuário
* **test**: teste de token atual baseado no *secret*
* **secret**: OTP secret (string aleatória alfanumérica de no mínimo 15 caracteres)

Respostas:

* **enableotp_success**: êxito
* OU **enableotp_error**: erro
	* **err*: 'test' caso o teste esteja incorreto ou 'pwd' se a senha esteja errada,

## disable_otp 🔑

Desabilita o 2FA.

Argumentos:

* **password**: senha do usuário

Resposta:

* **disableotp_success**: êxito
* **disableotp_error**: erro                                                                                                    

## update 🔑

Atualiza o e-mail ou a senha do usuário.

Argumentos:

* **password**: senha atual
* **new_password** (opcional): nova senha
* **email** (opcional): novo endereço de e-mail

Resposta:

* **memberupdatepasswordsuccess**: êxito
* OU **memberupdatefail: erro: senha atual inválida
* OU **memberloginmustverify**: novo e-mail alterado, porém é necessário confirmar

# notifications

Obtém notificações do usuário.

## getUnread 🔑

Obtém notificações não lidas.

Argumentos: ~

Resposta:

* **notifications.unreadList**
	* *Array* de objetos:
		* **id**: identificador interno da notificação
		* **date**: data da notificação
		* **message**: mensagem legível

## getAll 🔑

Obtém todas as notificações.

Argumentos: ~

Resposta:

* **notifications.allList**
	* *Array* de objetos:
		* **id**: identificador interno da notificação
		* **date**: data da notificação
		* **message**: mensagem legível
		* **read**: `1` para lida, `0` para não lida

## markAsRead 🔑

Marca uma notificação como lida.

Argumentos:

* **id**: identificador interno da notificação

Resposta: ~

# orderbook

Lê o livro de ofertas.

## getbook

Obtém o livro de ofertas (limitado a 1000 ofertas) ordenado começando da ordem mais vantajosa.

Argumentos: ~

Resposta: 

* **orderbook**
	* *Array* de objetos:
		* **nick**: Identificação do usuário (nome aleatório de uma capital ou centro financeiro seguido de um conjunto único de letras e números)
		* **amount_crypto**: Quantidade de criptomoeda que carrega a ordem, caso esta seja uma ordem de venda. A cada negociação parcial, o valor negociado é deduzido deste item.
		* **amount_fiat**: Quantidade de fiduciária que carrega a ordem, caso esta seja uma ordem de compra. A cada negociação parcial, o valor negociado é deduzido deste item.
		* **crypto\_price\_min**: Cotação mínima (em ordens de compra)
		* **crypto\_price\_max**: Cotação máxima (em ordens de venda)
		* **type**: "buy" se esta for uma ordem de compra ou "sell" se for uma ordem de venda

# orders

Controla e emite ordens.

## sell 🔑

Emite uma ordem de venda.

Argumentos:

* **crypto_amount**: Quantidade de criptomoeda a vender (deve ser maior que 20000 satoshis)
* **crypto_price**: Cotação desejada

Resposta:

* **order_emitted**: êxito
* OU **under_lower_limit**: quantidade é inferior a 20000 satoshis
* OU **toosmallamount**: quantidade muito baixa após dedução de taxas
* OU **insuficientfunds**: usuário não possui saldo suficiente (em criptomoeda)

## buy 🔑

Emite uma ordem de compra.

Argumentos:

* **crypto_amount**: Quantidade de criptomoeda a comprar (deve ser maior que 20000 satoshis)
* **crypto_price**: Cotação desejada

Resposta:

* **order_emitted**: êxito
* OU **under_lower_limit**: quantidade é inferior a 20000 satoshis
* OU **toosmallamount**: quantidade muito baixa após dedução de taxas
* OU **insuficientfunds**: usuário não possui saldo suficiente (em fiduciária)

## stoplimit 🔑

Emite uma ordem de compra.

Argumentos:

* **crypto_amount**: Quantidade de criptomoeda a comprar (deve ser maior que 20000 satoshis)
* **crypto_price**: Cotação desejada da ordem resultante
* **trigger**: Cotação gatilho
* **type**: "buy" para engatilhar uma ordem de compra ou "sell" para engatilhar uma ordem de venda

Resposta:

* **order_emitted**: êxito
* OU **under_lower_limit**: quantidade é inferior a 20000 satoshis
* OU **toosmallamount**: quantidade muito baixa após dedução de taxas
* OU **insuficientfunds**: usuário não possui saldo suficiente (em fiduciária)

## myorders 🔑

Obtém ordens ativas do usuário.

Argumentos: ~

Resposta:

* **myorders**
	* *Array* de objetos
		* **id**: identificador interno
		* **initial\_amount\_crypto**: quantidade de criptomoeda, ao início da ordem
		* **amount_crypto**: quantidade restante de criptomoeda
		* **crypto**: identificador interno da criptomoeda
		* **initial\_amount\_fiat**: quantidade de fiduciária, ao início da ordem
		* **amount_fiat**: quantidade restante de fiduciária
		* **fiat**: identificador interno da fiduciária
		* **crypto\_price\_min**: cotação mínima (ordens de venda)
		* **crypto\_price\_max**: cotação máxima (ordens de compra)
		* **created_at**: data da ordem
		* **updated_at**: última atualização

## myoldorders 🔑

Obtém ordens concluídas do usuário.

Argumentos: ~

Resposta:

* **myoldorders**
	* *Array* de objetos
		* **id**: identificador interno
		* **initial\_amount\_crypto**: quantidade de criptomoeda, ao início da ordem
		* **amount_crypto**: quantidade restante de criptomoeda
		* **crypto**: identificador interno da criptomoeda
		* **initial\_amount\_fiat**: quantidade de fiduciária, ao início da ordem
		* **amount_fiat**: quantidade restante de fiduciária
		* **fiat**: identificador interno da fiduciária
		* **crypto\_price\_min**: cotação mínima (ordens de venda)
		* **crypto\_price\_max**: cotação máxima (ordens de compra)
		* **created_at**: data da ordem
		* **updated_at**: última atualização

## myspecialorders 🔑

Obtém ordens especiais (stop-limit) do usuário.

Argumentos: ~

Resposta:

* **myspecialorders**
	* *Array* de objetos
		* **id**: identificador interno
		* **type**: ordem resultante: "buy" para compra e "sell" para venda
		* **crypto_amount**: quantidade de criptomoeda
		* **crypto**: identificador interno da criptomoeda
		* **fiat_amount**: quantidade restante de fiduciária
		* **fiat**: identificador interno da fiduciária
		* **crypto\_price\_min**: cotação mínima (ordens de venda)
		* **crypto\_price\_max**: cotação máxima (ordens de compra)
		* **trigger**: cotação gatilho
		* **created_at**: data da ordem

## deleteorder 🔑

Exclui uma ordem e estorna o valor restante, bem como taxa relativa ao valor.

Argumentos:

* **order_id**: identificador interno da ordem

## deletespecialorder 🔑

Exclui uma ordem especial (stop-limit) e estorna o valor restante, bem como taxa relativa ao valor.

Argumentos:

* **order_id**: identificador interno da ordem

# profile

Controla detalhes do perfil.

## getdetails 🔑

Obtém detalhes do perfil do usuário.

Argumentos: ~ 

Resposta:

* **profiledetailgetsuccess**
	* **id**: identificador interno do usuário
	* **language**: idioma
	* **fullname**: nome completo
	* **nickname**: apelido (nome aleatório de uma capital ou centro financeiro seguido de um conjunto único de letras e números)
	* **email**: e-mail
	* **phone**: telefone
	* **city**: cidade
	* **region**: identificador interno do estado, província ou região
	* **country_id**: identificador interno do país
	* **country_name**: nome do país
	* **level**: nível do usuário
	* **gravatar**: URL do avatar do usuário

## editdetails 🔑

Edita um ou mais detalhes do perfil do usuário.

Argumentos:

* **newData**: *Array* de objetos:

	* **language**, **fullname**, **phone**, **city** ou **region**: valor
	* ...

Resposta:

* profileeditdetailssuccess


# profiledetails

Controla detalhes adicionais do perfil do usuário.

## getProfileDetails 🔑

Obtém detalhes do perfil.

Argumentos: ~

Resposta:

* profiledetails
	* *Array* de objetos:
		* **gender**: gênero (M ou F)
		* **cpf**: CPF ou CNPJ

## setProfileDetail 🔑

Define um detalhe do perfil.

Argumentos:

* **key**: "gender" ou "cpf"
* **value**: valor

Resposta: ~

## enableface 🔑

Habilita o reconhecimento facial.

Argumentos:

* **cpf**: CPF do usuário (será armazenado)
* **name**: nome completo do usuário
* **gender**: gênero
* **b64**: imagem da face do usuário em base64 (vide [member.login](#login))

Resposta:

* **profiledetails**: êxito
* **enablefaceerror**: erro
	* Erro (vide [member.login](#login))

# sessions

Controla sessões.

## listActiveSessions 🔑

Lista sessões ativas.

Argumentos: ~ 

Resposta:

* **activesessionslist**
	* **ip**: IP que acessa a sessão
	* **location**: localização aproximada, legível
	* **ua**: User-Agent
	* **browser**: navegador e sistema operacional (legível, amigável)
	* **browser_id**: fingerprint do navegador
	* **key**: chave da sessão
	* **created_at**: horário de login
	* **updated_at**: último acesso

## closeactivesession

Fecha uma sessão.

Argumentos:

* **sess2close**: chave da sessão a fechar

Resposta: ~

# sitebankaccs

Exibe lista de bancos.

## list

Retorna uma lista com todos os bancos que possuem ou não possuem convênio com a plataforma (e, portanto, há de se deduzir valor de transferência).

Argumentos: ~

Resposta:

* **sitebanks**: bancos conveniados; *Array* de objetos
	* **bank_name**: nome do banco
	* **bank_data**: informações para depósito (legível, tags HTML incluídas)

* **allbanks**: bancos não conveniados; *Array* de objetos
	* **id**: identificador interno
	* **code**: código de compensação banco
	* **bank_name**: nome do banco
	* **is_favorite**: `1` se o banco for mais utilizado; caso contrário, `0`

# ticker

Provê informações de ticker.

## get

Obtém ticker.

Argumentos: ~

Resposta:

* **ticker**
	* **last**: cotação da última negociação
	* **open**: preço de abertura do período de 24 horas
	* **high**: alta do período de 24 horas
	* **low**: baixa do período de 24 horas
	* **vol_crypto**: volume em criptomoeda negociado
	* **vol_fiat**: volume em fiduciária negociado

# userdocuments

Controla processos de upgrade de conta.

## sendprocess 🔑

Inicia um processo de upgrade manual.

Argumentos:

* **cpf**: CPF do usuário (será armazenado)
* **name**: nome completo do usuário
* **gender**: gênero
* **phone**: telefone
* **b64**: imagem da face do usuário em base64 (vide [member.login](#login))
* **docs**: *Array* de objetos
	* **url**: URL da imagem no servidor de armazenamento (vide [upload](#upload)
	* **type**: Código do documento

Resposta:

* **upgrade_process_sent**: êxito
* **enablefaceerror**: erro (vide [member.login](#login))

## mobileprocess 🔑

Inicia um processo de upgrade de conta via SMS.

Argumentos:

* **cpf**: CPF do usuário (será armazenado)
* **name**: nome completo do usuário
* **gender**: gênero
* **phone**: telefone

Resposta:

* **mobile_upgrade_process_sent**


## checkprocess 🔑

Verifica a conclusão dos processos do usuário.

Argumentos: ~

Respostas:

* **upgrade_success**: êxito
	* **level**: nível alcançado

# withdrawals

Controla saques.


## withdraw_fiat 🔑

Solicita um saque em fiduciária.

Argumentos:

* **amount**: quantidade
* **currency**: identificador interno (numérico) da moeda (ver [common](#common))
* **bank**: *Objeto*
	* **Banco**: código do banco (vide [sitebankaccs](#sitebankaccs))
	* **Agencia**
	* **Conta**: conta com dígito
	* **CPF**
	* **Tipo**: tipo da conta ("PF" para pessoa física, "PJ" para pessoa jurídica, "Poup." para poupança)

## withdraw_crypto 🔑

Solicita um saque em criptomoeda.

Argumentos:

* **amount**: quantidade
* **currency**: identificador interno (numérico) da criptomoeda (ver [common](#common))
* **fee**: taxa de mineração (por bytes)
* **wallet**: carteira de destino
* **password**: senha do usuário

Resposta:

* **withdraw_sent**

## list_crypto 🔑

Lista saques em criptomoeda.

Argumentos: ~

Resposta:

* **withdrawallist_cryptosuccess**: *Array* de objetos
	* **id**: identificador interno
	* **wallet**: carteira
	* **txid**: TxID na blockchain
	* **amount**: quantidade
	* **status**: "pending", "working", "done", "hold" (em espera para saque manual da cold wallet) ou "disapproved"
	* **currency**: identificador interno da moeda fiduciária
	* **created_at**: data do lançamento
	* **updated_at**: última atualização

## list_fiat 🔑

Lista saques em fiduciária.

Argumentos: ~

Resposta:

* **withdrawallist_fiatsuccess**: *Array* de objetos
	* **id**: identificador interno
	* **bank**: identificador interno do banco
	* **amount**: quantidade
	* **status**: "pending", "done" ou "disapproved"
	* **currency**: identificador interno da moeda fiduciária
	* **created_at**: data do lançamento
	* **updated_at**: última atualização
