---

![Logo do Projeto](ImagemProjeto(SmartVitals).png)

# 🩺 **SmartVital**

API RESTful para **monitoramento de pacientes**, **gestão de profissionais de saúde** e **emissão de relatórios clínicos**.
Desenvolvida para uso em ambientes hospitalares, unidades de pronto atendimento e clínicas, com foco em **segurança, rastreabilidade e padronização de dados médicos**.

---

## **1. Especificações Gerais**

| **Parâmetro**          | **Descrição**                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------- |
| **Arquitetura**        | RESTful                                                                             |
| **Formato de Dados**   | JSON                                                                                |
| **Autenticação**       | Baseada em credenciais (`senha`)                                                    |
| **Códigos de Sucesso** | `200 OK`, `201 Created`, `204 No Content`                                           |
| **Códigos de Erro**    | `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error` |

---

## **2. Estrutura das Entidades**

### 👤 **Paciente**

Representa o indivíduo monitorado pela plataforma.

| Campo              | Tipo   | Descrição                         |
| ------------------ | ------ | --------------------------------- |
| `id`               | number | Identificador único               |
| `temperatura`      | number | Temperatura corporal (°C)         |
| `indice_glicemico` | number | Índice glicêmico (mg/dL)          |
| `pressao_arterial` | string | Exemplo: `"120/80"`               |
| `saturacao`        | number | Saturação de oxigênio (%)         |
| `pulso`            | number | Frequência cardíaca (bpm)         |
| `respiracao`       | number | Frequência respiratória (rpm)     |
| `peso`             | number | Peso corporal (kg)                |
| `altura`           | number | Altura (m)                        |
| `idade`            | number | Idade em anos                     |

---

### 👤 **Agente de Saúde**

Inclui **médicos, enfermeiros e técnicos**. Responsável por supervisionar pacientes e gerar relatórios.

| Campo            | Tipo                | Descrição                                        |
| ---------------- | ------------------- | ------------------------------------------------ |
| `id`             | number              | Identificador único                              |
| `nome`           | string              | Nome completo                                    |
| ``          | string              |  de acesso do agente                        |
| `cargo`          | string              | Exemplo: `"Médico"`, `"Enfermeiro"`, `"Técnico"` |
| `crm`            | string *(opcional)* | Registro profissional do médico                  |
| `dataDeAdmissao` | string              | Data de admissão (`YYYY-MM-DD`)                  |

---

### 📄 **Relatório Clínico**

Gerado exclusivamente por **agentes de saúde** para acompanhamento de pacientes.

| Campo         | Tipo    | Descrição                              |
| ------------- | ------- | -------------------------------------- |
| `id`          | number  | Identificador único                    |
| `id_paciente` | number  | ID do paciente relacionado             |
| `id_agente`   | number  | ID do agente responsável               |
| `completo`    | boolean | Indica se o relatório foi finalizado   |
| `incompleto`  | boolean | Indica se o relatório está pendente    |
| `observacao`  | string  | Texto livre com observações clínicas   |
| `data`        | string  | Data ISO-8601 (`YYYY-MM-DDTHH:mm:ssZ`) |

---

## **3. Endpoints de Pacientes**

> ⚠️ **Atenção:** Pacientes **não possuem acesso a relatórios clínicos**.
> Apenas **Agentes de Saúde** podem criar, visualizar e editar relatórios.

---

### **3.1 POST /pacientes**

Cria um novo paciente no sistema.

**Request**

```json
{
  "idade": 30,
  "peso": 75.0,
  "altura": 1.70
}
```

**Response (201 Created)**

```json
{
  "id": 1,
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

### **3.2 GET /pacientes**

Lista todos os pacientes cadastrados.

**Response (200 OK)**

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

### **3.3 GET /pacientes/{id}**

Retorna as informações completas de um paciente específico.

**Response (200 OK)**

```json
{
  "id": 1,
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

### **3.4 PUT /pacientes/{id}**

Atualiza **todos os campos** de um paciente.

**Request**

```json
{
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

**Response (200 OK)**

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

### **3.5 DELETE /pacientes/{id}**

Remove permanentemente um paciente.

**Response (204 No Content)**

```json
{}
```

---

### **3.6 GET /pacientes/{id}/vitals**

Retorna apenas os sinais vitais do paciente.

**Response (200 OK)**

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

### **3.7 PATCH /pacientes/{id}/peso**

**Request**

```json
{ "peso": 78.0 }
```

**Response (200 OK)**

```json
{ "mensagem": "Peso atualizado com sucesso." }
```

---

### **3.8 PATCH /pacientes/{id}/idade**

**Request**

```json
{ "idade": 35 }
```

**Response (200 OK)**

```json
{ "mensagem": "Idade atualizada com sucesso." }
```

---

### **3.9 PATCH /pacientes/{id}/pressao**

**Request**

```json
{ "pressao_arterial": "130/85" }
```

**Response (200 OK)**

```json
{ "mensagem": "Pressão arterial atualizada com sucesso." }
```

---

## **4. Endpoints de Agentes de Saúde**

---

### **4.1 POST /agentes**

Cria um novo agente de saúde.

**Request**

```json
{
  "nome": "Dra. Ana Souza",
  "senha": "senhaForte123",
  "cargo": "Médico",
  "crm": "CRM-SP 43210",
  "dataDeAdmissao": "2024-06-01"
}
```

**Response (201 Created)**

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

### **4.2 GET /agentes**

**Response (200 OK)**

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

### **4.3 GET /agentes/{id}**

**Response (200 OK)**

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

### **4.4 PATCH /agentes/{id}**

**Request**

```json
{ "cargo": "Coordenador Médico" }
```

**Response (200 OK)**

```json
{ "mensagem": "Dados do agente atualizados com sucesso." }
```

---

### **4.5 DELETE /agentes/{id}**

**Response (204 No Content)**

```json
{}
```

---

## **5. Endpoints de Relatórios**

> 🔒 **Acesso exclusivo dos Agentes de Saúde.**
> Pacientes não podem criar, visualizar ou modificar relatórios.

---

### **5.1 POST /relatorios**

**Request**

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

**Response (201 Created)**

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

### **5.2 GET /relatorios/{id}**

**Response (200 OK)**

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

### **5.3 GET /pacientes/{id}/relatorios**

Lista todos os relatórios vinculados a um paciente.
**Somente acessível por agentes.**

**Response (200 OK)**

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

### **5.4 PUT /relatorios/{id}/completo**

**Response (200 OK)**

```json
{ "mensagem": "Relatório marcado como completo." }
```

---

### **5.5 PUT /relatorios/{id}/incompleto**

**Response (200 OK)**

```json
{ "mensagem": "Relatório marcado como incompleto." }
```

---

### **5.6 GET /relatorios/pendentes**

**Response (200 OK)**

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

## **6. Resumo Técnico**

| Entidade            | Total de Endpoints | Permissão                                |
| ------------------- | ------------------ | ---------------------------------------- |
| **Paciente**        | 9                  | Acesso apenas aos próprios dados         |
| **Agente de Saúde** | 5                  | Acesso completo a pacientes e relatórios |
| **Relatório**       | 6                  | Exclusivo de agentes de saúde            |

---
