# 🧩 Taller Final - Estructuras de Datos y Algoritmos 2

Proyecto final desarrollado para el curso de **Estructuras de Datos**, implementando un sistema completo **Full Stack (FastAPI + React)** que permite crear, 
visualizar y analizar grafos mediante algoritmos clásicos (BFS y Dijkstra), con autenticación segura y persistencia en base de datos.

## 🚀 Tecnologías utilizadas

### 🖥️ Frontend
- **React + Vite**
- **React Router DOM** para navegación entre vistas

### ⚙️ Backend
- **FastAPI** (Python)
- **SQLModel / SQLite** para base de datos
- **JWT (JSON Web Token)** para autenticación segura

## 🧠 Funcionalidades principales

### 🔐 Autenticación y seguridad
- Registro y login de usuarios con validación.
- Hashing de contraseñas mediante `bcrypt`.
- Tokens JWT con expiración automática.
- Rutas protegidas (`/api/auth/me`) que verifican el token del usuario antes de permitir acceso.

### 🧱 CRUD de grafo
- **Nodos**: creación, listado y eliminación.
- **Aristas**: conexión entre nodos con peso validado (> 0) y verificación de existencia de nodos (`FK`).
- Validaciones y respuestas HTTP adecuadas (`400`, `404`).
- Visualización de los elementos desde el frontend con diseño claro y botones de acción.

### 🧮 Algoritmos implementados 
#### 🔍 BFS (Breadth-First Search)
- Muestra el **orden de exploración** y el **árbol resultante** del recorrido desde un nodo inicial.

#### 🧭 Dijkstra
- Calcula la **ruta más corta** entre dos nodos válidos.
- Devuelve tanto el **camino** como la **distancia total**.
- Manejo de casos sin conexión (retorna `404 no path between src and dst`).

## ⚙️ Instalación y ejecución

### 📦 Backend

# 1. Clonar el repositorio
  ```bash
git clone https://github.com/Isabela1105/Taller-Final-Estructuras-.git
cd \Taller-Final-Estructuras--main\Taller-Final-Estructuras--main\Backend

# 2. Crear entorno virtual
```bash
python -m venv venv
venv\Scripts\activate  # (Windows)
# source venv/bin/activate  (Linux/Mac)

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Ejecutar el servidor
uvicorn app.main:app --reload

### *** Frontend *** 
```bash
cd ../Frontend
npm install
npm run dev

