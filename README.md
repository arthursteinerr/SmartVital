![Logo do Projeto](SmartVital.png)

# 📘 **Documentação Completa da API SmartVital**

API RESTful para **monitoramento de pacientes**, **gestão de profissionais de saúde** e **emissão de relatórios clínicos**.

---

## **1. Especificações Gerais**

| Detalhe     | Especificação                             |
| ----------- | ----------------------------------------- |
| Arquitetura | RESTful                                   |
| Formato     | JSON                                      |
| Sucesso     | `200 OK`, `201 Created`, `204 No Content` |
| Erros       | `400 Bad Request`, `404 Not Found`        |

---

## **2. Estrutura das Entidades**

### **Paciente**

| Atributo           | Tipo   | Descrição                 |
| ------------------ | ------ | ------------------------- |
| `id`               | number | Identificador único       |
| `senha`            | string | Senha de acesso           |
| `temperatura`      | number | Temperatura corporal (°C) |
| `indice_glicemico` | number | Glicemia (mg/dL)          |
| `pressao_arterial` | string | Ex: `"120/80"`            |
| `saturacao`        | number | Saturação de O₂ (%)       |
| `pulso`            | number | Batimentos por minuto     |
| `respiracao`       | number | Respiração por minuto     |
| `peso`             | number | Peso (kg)                 |
| `altura`           | number | Altura (m)                |
| `idade`            | number | Idade (anos)              |

---

### **Agente de Saúde**

| Atributo         | Tipo                | Descrição              |
| ---------------- | ------------------- | ---------------------- |
| `id`             | number              | Identificador único    |
| `nome`           | string              | Nome completo          |
| `senha`          | string              | Senha de acesso        |
| `cargo`          | string              | Ex: Médico, Enfermeiro |
| `crm`            | string *(opcional)* | Registro profissional  |
| `dataDeAdmissao` | string              | `YYYY-MM-DD`           |

---

### **Relatório**

| Atributo      | Tipo    | Descrição                         |
| ------------- | ------- | --------------------------------- |
| `id`          | number  | Identificador único               |
| `id_paciente` | number  | ID do paciente                    |
| `id_agente`   | number  | ID do agente                      |
| `completo`    | boolean | Status finalizado                 |
| `incompleto`  | boolean | Status pendente                   |
| `observacao`  | string  | Texto clínico                     |
| `data`        | string  | ISO-8601 (`2025-10-14T10:00:00Z`) |

---

## **3. Endpoints de Pacientes**

> ⚠️ **Pacientes não têm acesso aos relatórios.** Apenas Agentes de Saúde podem criar, ler e atualizar relatórios.

---

### 3.1 `POST /pacientes` – Criar Paciente

**Request:**

```json
{
  "senha": "senhaSegura",
  "idade": 30,
  "peso": 75.0,
  "altura": 1.70
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "senha": "senhaSegura",
  "idade": 30,
  "peso": 75.0,
  "altura": 1.70,
  "temperatura": null,
  "indice_glicemico": null,
  "pressao_arterial": null,
  "saturacao": null,
  "pulso": null,
  "respiracao": null
}
```

---

### 3.2 `GET /pacientes` – Listar Pacientes

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "idade": 30,
    "peso": 75.0,
    "altura": 1.70
  },
  {
    "id": 2,
    "idade": 45,
    "peso": 82.5,
    "altura": 1.80
  }
]
```

---

### 3.3 `GET /pacientes/{id}` – Detalhar Paciente

**Response (200 OK):**

```json
{
  "id": 1,
  "senha": "senhaSegura",
  "idade": 30,
  "peso": 75.0,
  "altura": 1.70,
  "temperatura": 36.5,
  "indice_glicemico": 95.2,
  "pressao_arterial": "120/80",
  "saturacao": 98,
  "pulso": 72,
  "respiracao": 16
}
```

---

### 3.4 `PUT /pacientes/{id}` – Atualização Completa

**Request:**

```json
{
  "senha": "novaSenha",
  "idade": 31,
  "peso": 76.0,
  "altura": 1.70,
  "temperatura": 37.0,
  "indice_glicemico": 100.0,
  "pressao_arterial": "125/85",
  "saturacao": 97,
  "pulso": 75,
  "respiracao": 17
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "idade": 31,
  "peso": 76.0,
  "altura": 1.70,
  "temperatura": 37.0,
  "indice_glicemico": 100.0,
  "pressao_arterial": "125/85",
  "saturacao": 97,
  "pulso": 75,
  "respiracao": 17
}
```

---

### 3.5 `DELETE /pacientes/{id}` – Remover Paciente

**Response (204 No Content):**

```json
{}
```

---

### 3.6 `GET /pacientes/{id}/vitals` – Sinais Vitais

**Response (200 OK):**

```json
{
  "temperatura": 36.5,
  "indice_glicemico": 95.2,
  "pressao_arterial": "120/80",
  "saturacao": 98,
  "pulso": 72,
  "respiracao": 16
}
```

---

### 3.7 `PATCH /pacientes/{id}/peso` – Atualizar Peso

**Request:**

```json
{
  "peso": 78.0
}
```

**Response (200 OK):**

```json
{
  "mensagem": "Peso atualizado com sucesso."
}
```

---

### 3.8 `PATCH /pacientes/{id}/idade` – Atualizar Idade

**Request:**

```json
{
  "idade": 35
}
```

**Response (200 OK):**

```json
{
  "mensagem": "Idade atualizada com sucesso."
}
```

---

### 3.9 `PATCH /pacientes/{id}/pressao` – Atualizar Pressão Arterial

**Request:**

```json
{
  "pressao_arterial": "130/85"
}
```

**Response (200 OK):**

```json
{
  "mensagem": "Pressão arterial atualizada com sucesso."
}
```

---

## **4. Endpoints de Agentes de Saúde**

### 4.1 `POST /agentes` – Criar Agente de Saúde

**Request:**

```json
{
  "nome": "Dra. Ana Souza",
  "senha": "senhaForte123",
  "cargo": "Médico",
  "crm": "CRM-SP 43210",
  "dataDeAdmissao": "2024-06-01"
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "nome": "Dra. Ana Souza",
  "cargo": "Médico",
  "crm": "CRM-SP 43210",
  "dataDeAdmissao": "2024-06-01"
}
```

---

### 4.2 `GET /agentes` – Listar Agentes

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "nome": "Dra. Ana Souza",
    "cargo": "Médico",
    "crm": "CRM-SP 43210",
    "dataDeAdmissao": "2024-06-01"
  },
  {
    "id": 2,
    "nome": "Carlos Mendes",
    "cargo": "Enfermeiro",
    "dataDeAdmissao": "2023-02-10"
  }
]
```

---

### 4.3 `GET /agentes/{id}` – Detalhar Agente

**Response (200 OK):**

```json
{
  "id": 1,
  "nome": "Dra. Ana Souza",
  "cargo": "Médico",
  "crm": "CRM-SP 43210",
  "dataDeAdmissao": "2024-06-01"
}
```

---

### 4.4 `PATCH /agentes/{id}` – Atualizar Dados do Agente

**Request:**

```json
{
  "cargo": "Coordenador Médico"
}
```

**Response (200 OK):**

```json
{
  "mensagem": "Dados do agente atualizados com sucesso."
}
```

---

### 4.5 `DELETE /agentes/{id}` – Remover Agente

**Response (204 No Content):**

```json
{}
```

---

## **5. Endpoints de Relatórios**

> 🔒 **Acesso exclusivo de Agentes de Saúde.**
> Pacientes **não podem** criar, ler, nem atualizar relatórios.

---

### 5.1 `POST /relatorios` – Criar Relatório

**Request:**

```json
{
  "id_paciente": 1,
  "id_agente": 2,
  "completo": false,
  "incompleto": true,
  "observacao": "Paciente apresenta febre leve. Recomendado repouso e hidratação.",
  "data": "2025-10-14T10:00:00Z"
}
```

**Response (201 Created):**

```json
{
  "id": 10,
  "id_paciente": 1,
  "id_agente": 2,
  "completo": false,
  "incompleto": true,
  "observacao": "Paciente apresenta febre leve. Recomendado repouso e hidratação.",
  "data": "2025-10-14T10:00:00Z"
}
```

---

### 5.2 `GET /relatorios/{id}` – Detalhar Relatório

**Response (200 OK):**

```json
{
  "id": 10,
  "id_paciente": 1,
  "id_agente": 2,
  "completo": false,
  "incompleto": true,
  "observacao": "Paciente apresenta febre leve. Recomendado repouso e hidratação.",
  "data": "2025-10-14T10:00:00Z"
}
```

---

### 5.3 `GET /pacientes/{id}/relatorios` – Listar Relatórios do Paciente *(apenas para agentes)*

**Response (200 OK):**

```json
[
  {
    "id": 10,
    "completo": false,
    "incompleto": true,
    "observacao": "Paciente apresenta febre leve. Recomendado repouso e hidratação.",
    "data": "2025-10-14T10:00:00Z"
  },
  {
    "id": 11,
    "completo": true,
    "incompleto": false,
    "observacao": "Paciente está estável, alta médica recomendada.",
    "data": "2025-10-13T15:30:00Z"
  }
]
```

---

### 5.4 `PUT /relatorios/{id}/completo` – Marcar Como Completo

**Response (200 OK):**

```json
{
  "mensagem": "Relatório marcado como completo."
}
```

---

### 5.5 `PUT /relatorios/{id}/incompleto` – Marcar Como Incompleto

**Response (200 OK):**

```json
{
  "mensagem": "Relatório marcado como incompleto."
}
```

---

### 5.6 `GET /relatorios/pendentes` – Listar Relatórios Incompletos

**Response (200 OK):**

```json
[
  {
    "id": 10,
    "id_paciente": 1,
    "id_agente": 2,
    "completo": false,
    "incompleto": true,
    "observacao": "Paciente apresenta febre leve. Recomendado repouso e hidratação.",
    "data": "2025-10-14T10:00:00Z"
  }
]
```

---

## **Resumo Final**

| Entidade            | Total de Endpoints | Acesso                                     |
| ------------------- | ------------------ | ------------------------------------------ |
| **Paciente**        | 9                  | Acesso ao próprio cadastro e sinais vitais |
| **Agente de Saúde** | 5                  | Acesso total (pacientes + relatórios)      |
| **Relatório**       | 6                  | Exclusivo de Agentes de Saúde              |

---
