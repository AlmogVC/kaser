# Keep Alive SErvice Registry - KASER

KASER will get "keep alive" messages from different services and will decide if they are alive or not.

## How it works

An [AliveSignal Message](##alivesignal-message) will be sent to KASER via the body in an HTTP POST method.

The message will contain the service's name.
If the service name is not registered in KASER, KASER will register it and will save it as follows:

```javascript
{
    name: aliveSignal.serviceName,
    lastContactDate: new Date(),
    currentAlivePeriodInSeconds: 0,
    longestAlivePeriodInSeconds: 0,
    longestDeadPeriodInSeconds: 0,
}
```

Else, if the service already exists in KASER, it's values will update.

Furthermore, the AliveSignal message will contain the hostname the message arrived from.
This hostname will be saved and linked to the service in [ServiceHost](##servicehost)

## AliveSignal Message

```javascript
{
    hostname: String,
    aliveDate: Date,
    createdAt: Date,
    serviceName: String,
    upTimeInSeconds: Number,
}
```

This structure will also save the createdAt date.
The createdAt is also a TTL Index that expires when `config.aliveSignal.expirationTimeInSeconds` has passed.

## Service

```javascript
{
    name: String,
    lastContactDate: Date,
    currentAlivePeriodInSeconds: Number,
    longestAlivePeriodInSeconds: Number,
    longestDeadPeriodInSeconds: Number,
}
```

**name** - The name of the service, this is a unique index, that means that only one document with this service's name can be created.

**lastContactDate** - The last time an aliveSignal with the service's name has arrived to KASER

**currentAlivePeriodInSeconds** - The time in seconds since the last time the service was [dead](###dead-service).

**longestAlivePeriodInSeconds** - The longest time in seconds that the service was not [dead](###dead-service).
Will only update if the currentAlivePeriodInSeconds is bigger than the current longestAlivePeriodInSeconds

**longestDeadPeriodInSeconds** -
The longest time in seconds the service was [dead](###dead-service).
Will only update if the current [silent period](###silence) is bigger than the current longestDeadPeriodInSeconds

## ServiceHost

This structure will save a hostname(instance) to a specific service.
Each service can have multiple hostnames linked to it, but an hostname can only be linked to one service.

This structure will also save the lastAliveSignal from the specific hostname.
The lastAliveSignal is also a TTL Index that expires when `config.serviceHost.expirationTimeInSeconds` has passed since the lastAliveSignal.

```javascript
{
    id?: String,
    hostname: String,
    service: String,
    createdAt?: Date,
    lastAliveSignal?: Date,
    upTimeInSeconds: Number,
}
```

## Definitions

### Dead Service

A service counts as dead if it's [silence](###silence) time have passed the configurable value, maxSilenceTimeInSeconds.

### Silence

The period between the last time an AliveSignal message for the service has arrived and the time the next message will (maybe) arrive counts as silence time for the service.

## API

### Alive Signal

#### HTTP - POST `api/aliveSignal`

#### RabbitMQ - route `'#.aliveSignal'`

Will create a new aliveSignal for a specific service.

-   Will create a new host for the service if the host does not exists and update it's `upTimeInSeconds`.
-   Will update the following properties for the service:
    -   `createdAt` - if this is the **first time** a message from the service was received, the current date will be saved.
    -   `lastContactDate` - update to current date.
    -   `longestDeadPeriodInSeconds` - If the service was currently **dead** and passed the last value the new time will be saved.
    -   `longestAlivePeriodInSeconds` - If the service was currently **alive** and passed the last value the new time will be saved.
    -   `currentAlivePeriodInSeconds` - if the service was currently **alive**, update the value to the current time it is alive

body

```javascript
{
    hostname: String,
    serviceName: String,
    aliveDate: Date,
    upTimeInSeconds: Number,
}
```

### Service

#### HTTP - GET `api/service`

Will return all the services and their state.

query params:

-   `includeHosts` - if set to `1` or `true` will return the hosts of each service, inside each service.
-   `areAlive`:
    -   if set to `1` or `true` will only return services that are considered alive.
    -   if set to `0` or `false` will only return dead services.

### Config

#### HTTP - GET `api/config`

Will return the config of the service.

Return value:

```javascript
{
    rabbitMQ: {
        isActive: Boolean,
        exchange: String,
        exchangeType: String,
        host: String,
        port: Number
    },
    service: {
        maxSilenceTimeInSeconds: Number,
    }
}
```
