# OpenWallet 🎁

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-338?style=for-the-badge&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=zustand&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

> 🇲🇽 Español | 🇺🇸 [English](#english-version)

## 🇲🇽 Español

### Descripción del Proyecto

**OpenWallet** es una aplicación web full stack de wallet de puntos y recompensas. Los owners crean organizaciones, invitan trabajadores por correo, dan recompensas en puntos y los trabajadores pueden transferirse puntos entre sí.

### 🛠️ Tech Stack

#### Backend

| Tecnología        | Uso                                                  |
| ----------------- | ---------------------------------------------------- |
| Node.js + Express | Servidor y API REST                                  |
| TypeScript        | Tipado estático                                      |
| Prisma ORM v7     | Manejo de base de datos                              |
| PostgreSQL        | Base de datos relacional                             |
| JWT               | Autenticación con Access/Refresh tokens con rotation |
| Bcrypt            | Encriptación de contraseñas                          |
| Zod               | Validación de schemas                                |
| Nodemailer        | Envío de emails de verificación e invitación         |

#### Frontend

| Tecnología              | Uso                               |
| ----------------------- | --------------------------------- |
| Next.js 15 (App Router) | Framework de React con SSR        |
| TypeScript              | Tipado estático                   |
| Tailwind CSS            | Estilos utilitarios               |
| shadcn/ui               | Componentes de interfaz           |
| React Hook Form         | Manejo de formularios             |
| Zod                     | Validación de formularios         |
| Zustand                 | Estado global (auth + org activa) |
| Fetch API               | Llamadas al backend               |

### 📁 Estructura del Proyecto

```
OpenWallet/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── config/
│       │   └── nodemailer.ts
│       ├── controllers/
│       │   ├── auth.controllers.ts
│       │   ├── organization.controllers.ts
│       │   ├── member.controllers.ts
│       │   └── transaction.controllers.ts
│       ├── middleware/
│       │   ├── authenticate.ts
│       │   ├── isOwner.ts
│       │   └── isMember.ts
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── organization.routes.ts
│       │   ├── member.routes.ts
│       │   └── transactions.routes.ts
│       ├── services/
│       │   ├── email.service.ts
│       │   └── token.service.ts
│       ├── lib/
│       │   └── prisma.ts
│       └── index.ts
│
└── frontend/
    └── src/
        ├── app/
        │   ├── (auth)/
        │   │   ├── login/
        │   │   └── register/
        │   ├── (dashboard)/
        │   │   ├── dashboard/
        │   │   └── org/[orgId]/
        │   ├── invite/[token]/
        │   └── verify-email/
        ├── components/
        │   ├── ui/
        │   ├── auth/
        │   ├── org/
        │   ├── members/
        │   ├── transactions/
        │   └── shared/
        ├── lib/
        │   ├── api/
        │   └── fetcher.ts
        ├── stores/
        │   ├── auth.store.ts
        │   └── org.store.ts
        └── types/
            └── index.ts
```

### ⚙️ Instalación y Configuración

#### Prerequisitos

- Node.js v18+
- PostgreSQL
- npm

#### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/OpenWallet.git
cd OpenWallet
```

#### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend/`:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/OpenWallet"
ACCESS_SECRET="tu_access_secret"
REFRESH_SECRET="tu_refresh_secret"
PORT=1234
CLIENT_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="tu_correo@gmail.com"
SMTP_PASS="tu_app_password"
```

Ejecuta las migraciones:

```bash
npx prisma migrate dev
npx prisma generate
```

Inicia el servidor:

```bash
npm run dev
```

#### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

Crea un archivo `.env.local` en la carpeta `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:1234/api
```

Inicia el cliente:

```bash
npm run dev
```

### 🔌 Endpoints de la API

#### Auth

| Método | Endpoint                   | Descripción              | Auth |
| ------ | -------------------------- | ------------------------ | ---- |
| POST   | `/api/register`            | Registrar usuario        | ❌   |
| GET    | `/api/verify-email?token=` | Verificar email          | ❌   |
| POST   | `/api/login`               | Iniciar sesión           | ❌   |
| POST   | `/api/logout`              | Cerrar sesión            | ✅   |
| POST   | `/api/refresh-token`       | Renovar access token     | ❌   |
| GET    | `/api/me`                  | Obtener usuario logueado | ✅   |

#### Organizaciones

| Método | Endpoint                                  | Descripción           | Auth     |
| ------ | ----------------------------------------- | --------------------- | -------- |
| POST   | `/api/organizations/create`               | Crear organización    | ✅       |
| GET    | `/api/organizations/my`                   | Mis organizaciones    | ✅       |
| GET    | `/api/organizations/:orgId`               | Obtener organización  | ✅       |
| DELETE | `/api/organizations/:orgId`               | Eliminar organización | ✅ Owner |
| POST   | `/api/organizations/:orgId/invite`        | Invitar miembro       | ✅ Owner |
| GET    | `/api/organizations/invite/:token`        | Info de invitación    | ❌       |
| POST   | `/api/organizations/invite/:token/accept` | Aceptar invitación    | ✅       |

#### Miembros

| Método | Endpoint                                | Descripción      | Auth      |
| ------ | --------------------------------------- | ---------------- | --------- |
| GET    | `/api/members/:orgId`                   | Obtener miembros | ✅ Member |
| PATCH  | `/api/members/:orgId/:memberId`         | Actualizar rol   | ✅ Owner  |
| DELETE | `/api/members/:orgId/:memberId`         | Eliminar miembro | ✅ Owner  |
| GET    | `/api/members/:orgId/:memberId/balance` | Ver balance      | ✅ Member |

#### Transacciones

| Método | Endpoint                                      | Descripción             | Auth      |
| ------ | --------------------------------------------- | ----------------------- | --------- |
| POST   | `/api/transactions/:orgId/reward/:memberId`   | Recompensar miembro     | ✅ Owner  |
| POST   | `/api/transactions/:orgId/transfer/:memberId` | Transferir puntos       | ✅ Member |
| GET    | `/api/transactions/:orgId`                    | Todas las transacciones | ✅ Owner  |
| GET    | `/api/transactions/:orgId/me`                 | Mis transacciones       | ✅ Member |

### 🗄️ Modelo de Base de Datos

```
users
  ├── ownedOrganizations → organizations (1:N)
  └── memberships → members (1:N)

organizations
  ├── owner → users
  ├── members → members (1:N)
  └── transactions → transactions (1:N)

members
  ├── user → users
  ├── organization → organizations
  ├── sentTransactions → transactions (1:N)
  └── receivedTransactions → transactions (1:N)

transactions
  ├── organization → organizations
  ├── fromMember → members (opcional, null en rewards)
  └── toMember → members
```

### 📸 Screenshots

### LandingPage

![LandingPage](./docs/screenshots/OW-Landing.png)

### Dashboard

![Dashboard](./docs/screenshots/OW-orgsPage.png)

### OrgPage

![OrgPage](./docs/screenshots/OW-orgPage.png)

### Invite Member

![InviteMember](./docs/screenshots/OW-InviteMember.png)

### Invitation Status

![InvitationStatus](./docs/screenshots/OW-InvitationStatus.png)

### Delete Organization

![DeleteOrg](./docs/screenshots/OW-DeleteOrg.png)

### Reward Member

![RewardMember](./docs/screenshots/OW-RewardDialog.png)

### Transfer to other member

![TransferDialog](./docs/screenshots/OW-TransferDialog.png)

### Delete Member

![DeleteMember](./docs/screenshots/OW-DeleteMemberDialog.png)

### Transactions List

![TransactionsList](./docs/screenshots/OW-TransactionList.png)

### 🔄 Flujos Importantes

**Registro y verificación de email:**
Usuario se registra → recibe email con token → hace click en link → cuenta verificada → puede hacer login

**Invitación de miembro:**
Owner invita por email → trabajador recibe link → acepta invitación → queda vinculado a la organización

**Reward (Owner → Miembro):**
Owner da puntos → se incrementa el balance del miembro y `totalPointsIssued` de la org → se registra en transactions

**Transfer (Miembro → Miembro):**
Se valida balance suficiente → se decrementa del emisor → se incrementa al receptor → se registra en transactions

**JWT Rotation:**
En cada refresh se genera nuevo `accessToken` + nuevo `refreshToken`, el anterior queda invalidado en DB

---

<a name="english-version"></a>

## 🇺🇸 English Version

### Project Description

**OpenWallet** is a full stack points and rewards wallet web application. Owners create organizations, invite workers by email, give point rewards, and workers can transfer points between each other.

### 🛠️ Tech Stack

#### Backend

| Technology        | Usage                                   |
| ----------------- | --------------------------------------- |
| Node.js + Express | Server and REST API                     |
| TypeScript        | Static typing                           |
| Prisma ORM v7     | Database management                     |
| PostgreSQL        | Relational database                     |
| JWT               | Auth with Access/Refresh token rotation |
| Bcrypt            | Password encryption                     |
| Zod               | Schema validation                       |
| Nodemailer        | Verification and invitation emails      |

#### Frontend

| Technology              | Usage                            |
| ----------------------- | -------------------------------- |
| Next.js 15 (App Router) | React framework with SSR         |
| TypeScript              | Static typing                    |
| Tailwind CSS            | Utility-first styling            |
| shadcn/ui               | UI components                    |
| React Hook Form         | Form management                  |
| Zod                     | Form validation                  |
| Zustand                 | Global state (auth + active org) |
| Fetch API               | Backend calls                    |

### ⚙️ Installation & Setup

#### Prerequisites

- Node.js v18+
- PostgreSQL
- npm

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/OpenWallet.git
cd OpenWallet
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/OpenWallet"
ACCESS_SECRET="your_access_secret"
REFRESH_SECRET="your_refresh_secret"
PORT=1234
CLIENT_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
```

Run migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the server:

```bash
npm run dev
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:1234/api
```

Start the client:

```bash
npm run dev
```

### 🔌 API Endpoints

#### Auth

| Method | Endpoint                   | Description          | Auth |
| ------ | -------------------------- | -------------------- | ---- |
| POST   | `/api/register`            | Register user        | ❌   |
| GET    | `/api/verify-email?token=` | Verify email         | ❌   |
| POST   | `/api/login`               | Login                | ❌   |
| POST   | `/api/logout`              | Logout               | ✅   |
| POST   | `/api/refresh-token`       | Refresh access token | ❌   |
| GET    | `/api/me`                  | Get logged user      | ✅   |

#### Organizations

| Method | Endpoint                                  | Description         | Auth     |
| ------ | ----------------------------------------- | ------------------- | -------- |
| POST   | `/api/organizations/create`               | Create organization | ✅       |
| GET    | `/api/organizations/my`                   | My organizations    | ✅       |
| GET    | `/api/organizations/:orgId`               | Get organization    | ✅       |
| DELETE | `/api/organizations/:orgId`               | Delete organization | ✅ Owner |
| POST   | `/api/organizations/:orgId/invite`        | Invite member       | ✅ Owner |
| GET    | `/api/organizations/invite/:token`        | Invite info         | ❌       |
| POST   | `/api/organizations/invite/:token/accept` | Accept invite       | ✅       |

#### Members

| Method | Endpoint                                | Description   | Auth      |
| ------ | --------------------------------------- | ------------- | --------- |
| GET    | `/api/members/:orgId`                   | Get members   | ✅ Member |
| PATCH  | `/api/members/:orgId/:memberId`         | Update role   | ✅ Owner  |
| DELETE | `/api/members/:orgId/:memberId`         | Remove member | ✅ Owner  |
| GET    | `/api/members/:orgId/:memberId/balance` | Get balance   | ✅ Member |

#### Transactions

| Method | Endpoint                                      | Description      | Auth      |
| ------ | --------------------------------------------- | ---------------- | --------- |
| POST   | `/api/transactions/:orgId/reward/:memberId`   | Reward member    | ✅ Owner  |
| POST   | `/api/transactions/:orgId/transfer/:memberId` | Transfer points  | ✅ Member |
| GET    | `/api/transactions/:orgId`                    | All transactions | ✅ Owner  |
| GET    | `/api/transactions/:orgId/me`                 | My transactions  | ✅ Member |

### 🗄️ Database Model

```
users
  ├── ownedOrganizations → organizations (1:N)
  └── memberships → members (1:N)

organizations
  ├── owner → users
  ├── members → members (1:N)
  └── transactions → transactions (1:N)

members
  ├── user → users
  ├── organization → organizations
  ├── sentTransactions → transactions (1:N)
  └── receivedTransactions → transactions (1:N)

transactions
  ├── organization → organizations
  ├── fromMember → members (optional, null on rewards)
  └── toMember → members
```

### 📸 Screenshots

### LandingPage

![LandingPage](./docs/screenshots/OW-Landing.png)

### Dashboard

![Dashboard](./docs/screenshots/OW-orgsPage.png)

### OrgPage

![OrgPage](./docs/screenshots/OW-orgPage.png)

### Invite Member

![InviteMember](./docs/screenshots/OW-InviteMember.png)

### Invitation Status

![InvitationStatus](./docs/screenshots/OW-InvitationStatus.png)

### Delete Organization

![DeleteOrg](./docs/screenshots/OW-DeleteOrg.png)

### Reward Member

![RewardMember](./docs/screenshots/OW-RewardDialog.png)

### Transfer to other member

![TransferDialog](./docs/screenshots/OW-TransferDialog.png)

### Delete Member

![DeleteMember](./docs/screenshots/OW-DeleteMemberDialog.png)

### Transactions List

![TransactionsList](./docs/screenshots/OW-TransactionList.png)

### 🔄 Key Flows

**Registration & email verification:**
User registers → receives email with token → clicks link → account verified → can login

**Member invitation:**
Owner invites by email → worker receives link → accepts invitation → gets linked to the organization

**Reward (Owner → Member):**
Owner gives points → member balance increments and org `totalPointsIssued` updates → recorded in transactions

**Transfer (Member → Member):**
Validates sufficient balance → decrements sender → increments receiver → recorded in transactions

**JWT Rotation:**
Each refresh generates a new `accessToken` + new `refreshToken`, the previous one is invalidated in DB
