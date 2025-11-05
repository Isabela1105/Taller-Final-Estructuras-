#  Taller Final - Estructuras de Datos y Algoritmos 2

Proyecto final desarrollado para el curso de **Estructuras de Datos y Algoritmos 2** y por Isabela Cabezas Obregon, Samuel Salazar Trujillo, Roiman Urrego Zuñiga , implementando un sistema completo **Full Stack (FastAPI + React)** que permite crear, 
visualizar y analizar grafos mediante algoritmos clásicos (BFS y Dijkstra), con autenticación segura y persistencia en base de datos.

##  Tecnologías utilizadas

###  Frontend
- **React + Vite**
- **React Router DOM** para navegación entre vistas

###  Backend
- **FastAPI** (Python)
- **SQLModel / SQLite** para base de datos
- **JWT (JSON Web Token)** para autenticación segura

##  Funcionalidades principales

###  Autenticación y seguridad
- Registro y login de usuarios con validación.
- Hashing de contraseñas mediante `bcrypt`.
- Tokens JWT con expiración automática.
- Rutas protegidas (`/api/auth/me`) que verifican el token del usuario antes de permitir acceso.

###  CRUD de grafo
- **Nodos**: creación, listado y eliminación.
- **Aristas**: conexión entre nodos con peso validado (> 0) y verificación de existencia de nodos (`FK`).
- Validaciones y respuestas HTTP adecuadas (`400`, `404`).
- Visualización de los elementos desde el frontend con diseño claro y botones de acción.

###  Algoritmos implementados 
####  BFS (Breadth-First Search)
- Muestra el **orden de exploración** y el **árbol resultante** del recorrido desde un nodo inicial.

####  Dijkstra
- Calcula la **ruta más corta** entre dos nodos válidos.
- Devuelve tanto el **camino** como la **distancia total**.
- Manejo de casos sin conexión (retorna `404 no path between src and dst`).

##  Instalación y ejecución

### Backend 

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/<usuario>/<repositorio>.git
   cd \Taller-Final-Estructuras--main\Taller-Final-Estructuras--main\Backend
2. Crear entorno virtual
   ```bash
   python -m venv venv
   venv\Scripts\activate  # En Windows
   source venv/bin/activate  # En Linux/Mac
3. Instalar dependencias
   ```bash
   pip install -r requirements.txt
  
4. Ejecutar el servidor:
   ```bash
   uvicorn app.main:app --reload


### **Frontend**

1. Ir al directorio del frontend:
   ```bash
   cd ../frontend
2. Instalar dependencias:
   ```bash
   npm install
3. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev

## Pruebas Minimas Manuales
### Registro
   ```bash
   Invoke-RestMethod -Method Post -Uri "$BASE/api/auth/register" `
   -ContentType "application/json" `
   -Body '{"username":"demo","password":"1234"}'
   ```
#### Respuesta del Sistema
   ```bash
   message
   -------
   ok
```

### Login
```bash
$login = Invoke-RestMethod -Method Post -Uri "$BASE/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"username":"demo","password":"1234"}'

$TOKEN = $login.access_token
$headers = @{ "Authorization" = "Bearer $TOKEN" }

Write-Host "TOKEN: $TOKEN"
```

#### Respuesta del Sistema
```bash
TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vIiwiZXhwIjoxNzYyMzA1Mjc5fQ.5fBWh-iOJ0x48dA11p5c2CgHGXPpxjXAeoVysl7Pq-w
```

### Perfil
```bash
Invoke-RestMethod -Method Get -Uri "$BASE/api/auth/me" -Headers $headers
```
#### Respuesta del Sistema
```bash
id username
-- --------
 3 demo
```

### Crear Nodo
```bash
Invoke-RestMethod -Method Post -Uri "$BASE/api/graph/nodes" `
>>   -Headers $headers `
>>   -ContentType "application/json" `
>>   -Body '{"name":"Bogota"}'
```
#### Respuesta del Sistema
```bash
id name
-- ----
 7 Bogota
```
### Listar Nodo
```bash
Invoke-RestMethod -Method Get -Uri "$BASE/api/graph/nodes" -Headers $headers
```
#### Respuesta del Sistema
```bash
id name        
-- ----
 1 Casa
 2 Universidad
 3 Mall Plaza
 4 Puerto 125
 5 Jardin Plaza
 6 Cali
 7 Bogota
```
### Crear Arista
```bash
Invoke-RestMethod -Method Post -Uri "$BASE/api/graph/edges" `
  -Headers $headers `
  -ContentType "application/json" `
  -Body '{"src_id":1,"dst_id":2,"weight":28}'
```
#### Respuesta del Sistema
```bash
id src_id dst_id weight
-- ------ ------ ------
 6      1      2   28,0
```
### BSF
```bash
Invoke-RestMethod -Method Get -Uri "$BASE/api/graph/bfs?start_id=1" -Headers $headers
```
#### Respuesta del Sistema
```bash
order     tree
-----     ----
{1, 2, 3} {@{node_id=1; parent_id=; depth=0}, @{node_id=2; parent_id=1; depth=1}, @{node_id=3; parent_id=1; depth=1}}
```
### Dijkstra
```bash
Invoke-RestMethod -Method Get -Uri "$BASE/api/graph/shortest-path?src_id=1&dst_id=3" -Headers $headers
```
#### Respuesta del Sistema
```bash
path   distance
----   --------
{1, 3}     11,5
