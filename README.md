![Logo do Projeto](src/img/ImagemProjeto\(SmartVitals\).png)

# 🩺 **SmartVital API**

A **SmartVital API** é uma aplicação RESTful projetada para o **monitoramento de pacientes**, **gestão de profissionais de saúde** e **emissão de relatórios clínicos** de forma digital e segura.

Com foco em **ambientes hospitalares, UTIs e clínicas**, a SmartVital permite **gerenciamento centralizado de dados médicos**, **padronização de informações** e **agilidade no atendimento clínico**.

---

## ⚙️ **1. Especificações da API**

| Parâmetro              | Descrição                         |
| :--------------------- | :-------------------------------- |
| **Arquitetura**        | RESTful                           |
| **Formato de Dados**   | JSON                              |
| **Codificação**        | UTF-8                             |
| **Autenticação**       | Nenhuma (modo de desenvolvimento) |
| **Códigos de Sucesso** | 200, 201, 204                     |
| **Códigos de Erro**    | 400, 404, 500                     |

---

### 📡 **1.1. Códigos HTTP**

| Código | Status                | Descrição                         |
| :----- | :-------------------- | :-------------------------------- |
| `200`  | OK                    | Requisição bem-sucedida           |
| `201`  | Created               | Recurso criado com sucesso        |
| `204`  | No Content            | Requisição processada sem retorno |
| `400`  | Bad Request           | Dados inválidos                   |
| `404`  | Not Found             | Recurso não encontrado            |
| `500`  | Internal Server Error | Erro interno do servidor          |

---

## 🧩 **2. Modelagem de Dados**

### 👤 **Paciente**

| Campo              | Tipo   | Descrição                       |
| :----------------- | :----- | :------------------------------ |
| `id`               | number | Identificador único do paciente |
| `nome`             | string | Nome completo                   |
| `idade`            | number | Idade em anos                   |
| `peso`             | number | Peso em quilogramas (kg)        |
| `altura`           | number | Altura em metros (m)            |
| `temperatura`      | number | Temperatura corporal em °C      |
| `indice_glicemico` | number | Nível de glicose (mg/dL)        |
| `pressao_arterial` | string | Exemplo: `"120/80"`             |
| `saturacao`        | number | Saturação de oxigênio (%)       |
| `pulso`            | number | Frequência cardíaca (bpm)       |
| `respiracao`       | number | Frequência respiratória (rpm)   |

---

### 👤 **Agente de Saúde**

| Campo                   | Tipo   | Descrição                           |
| :---------------------- | :----- | :---------------------------------- |
| `id`                    | number | Identificador único                 |
| `nome`                  | string | Nome completo                       |
| `senha`                 | string | Credencial de acesso                |
| `cargo`                 | string | Exemplo: `"Médico"`, `"Enfermeiro"` |
| `registro_profissional` | string | CRM, COREN, etc.                    |
| `data_admissao`         | string | Data ISO (`YYYY-MM-DD`)             |

---

### 📄 **Relatório Clínico**

| Campo           | Tipo    | Descrição                                |
| :-------------- | :------ | :--------------------------------------- |
| `id`            | number  | Identificador único do relatório         |
| `id_paciente`   | number  | ID do paciente vinculado                 |
| `id_agente`     | number  | ID do agente responsável                 |
| `observacao`    | string  | Observações clínicas                     |
| `data_registro` | string  | Data e hora (`YYYY-MM-DDTHH:mm:ssZ`)     |
| `completo`      | boolean | `true` = finalizado / `false` = pendente |

---

## 👥 **3. Endpoints de Pacientes**

---

### **3.1. POST /pacientes**

Cria um novo paciente.

#### 📨 Request

```json
{
  "nome": "Henrique Pereira",
  "idade": 30,
  "peso": 75.0,
  "altura": 1.70
}
```

#### 📤 Response (201)

```json
{
  "id": 1,
  "nome": "Henrique Pereira",
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

### **3.2. GET /pacientes**

Lista todos os pacientes.

#### 📤 Response (200)

```json
[
  {
    "id": 1,
    "nome": "Henrique Pereira",
    "idade": 30,
    "peso": 75.0,
    "altura": 1.70,
    "pressao_arterial": "120/80",
    "saturacao": 98
  },
  {
    "id": 2,
    "nome": "Maria Souza",
    "idade": 42,
    "peso": 68.5,
    "altura": 1.65,
    "pressao_arterial": "130/85",
    "saturacao": 97
  }
]
```

---

### **3.3. GET /pacientes/{id}**

Busca um paciente específico.

#### 📤 Response (200)

```json
{
  "id": 1,
  "nome": "Henrique Pereira",
  "idade": 30,
  "peso": 75.0,
  "altura": 1.70,
  "temperatura": 36.8,
  "indice_glicemico": 95,
  "pressao_arterial": "120/80",
  "saturacao": 98,
  "pulso": 75,
  "respiracao": 16
}
```

---

### **3.4. PUT /pacientes/{id}**

Atualiza **todos os campos** de um paciente.

#### 📨 Request

```json
{
  "nome": "Henrique Pereira",
  "idade": 31,
  "peso": 76.2,
  "altura": 1.70,
  "temperatura": 37.0,
  "indice_glicemico": 100,
  "pressao_arterial": "118/79",
  "saturacao": 99,
  "pulso": 80,
  "respiracao": 18
}
```

#### 📤 Response (200)

```json
{
  "id": 1,
  "nome": "Henrique Pereira",
  "idade": 31,
  "peso": 76.2,
  "altura": 1.70,
  "temperatura": 37.0,
  "indice_glicemico": 100,
  "pressao_arterial": "118/79",
  "saturacao": 99,
  "pulso": 80,
  "respiracao": 18
}
```

---

### **3.5. PATCH /pacientes/{id}/peso**

Atualiza apenas o peso.

#### 📨 Request

```json
{
  "peso": 77.3
}
```

#### 📤 Response (200)

```json
{
  "id": 1,
  "peso": 77.3
}
```

---

### **3.6. PATCH /pacientes/{id}/idade**

Atualiza apenas a idade.

#### 📨 Request

```json
{
  "idade": 32
}
```

#### 📤 Response (200)

```json
{
  "id": 1,
  "idade": 32
}
```

---

### **3.7. PATCH /pacientes/{id}/pressao**

Atualiza apenas a pressão arterial.

#### 📨 Request

```json
{
  "pressao_arterial": "125/83"
}
```

#### 📤 Response (200)

```json
{
  "id": 1,
  "pressao_arterial": "125/83"
}
```

---

### **3.8. GET /pacientes/{id}/sinais-vitais**

Retorna apenas os sinais vitais.

#### 📤 Response (200)

```json
{
  "id": 1,
  "temperatura": 36.9,
  "indice_glicemico": 98,
  "pressao_arterial": "120/80",
  "saturacao": 97,
  "pulso": 76,
  "respiracao": 17
}
```

---

### **3.9. DELETE /pacientes/{id}**

Remove permanentemente um paciente.

#### 📤 Response (204)

```
Sem conteúdo
```

---

## 🧑‍⚕️ **4. Endpoints de Agentes de Saúde**

---

### **4.1. POST /agentes**

Cria um novo agente.

#### 📨 Request

```json
{
  "nome": "Dra. Camila Nunes",
  "senha": "12345",
  "cargo": "Médico",
  "registro_profissional": "CRM-SP-456789",
  "data_admissao": "2022-10-05"
}
```

#### 📤 Response (201)

```json
{
  "id": 1,
  "nome": "Dra. Camila Nunes",
  "cargo": "Médico",
  "registro_profissional": "CRM-SP-456789",
  "data_admissao": "2022-10-05"
}
```

---

### **4.2. GET /agentes**

Lista todos os agentes.

#### 📤 Response (200)

```json
[
  {
    "id": 1,
    "nome": "Dra. Camila Nunes",
    "cargo": "Médico",
    "registro_profissional": "CRM-SP-456789",
    "data_admissao": "2022-10-05"
  },
  {
    "id": 2,
    "nome": "Enf. Pedro Lima",
    "cargo": "Enfermeiro",
    "registro_profissional": "COREN-123456",
    "data_admissao": "2023-01-11"
  }
]
```

---

### **4.3. GET /agentes/{id}**

Retorna um agente específico.

#### 📤 Response (200)

```json
{
  "id": 1,
  "nome": "Dra. Camila Nunes",
  "cargo": "Médico",
  "registro_profissional": "CRM-SP-456789",
  "data_admissao": "2022-10-05"
}
```

---

### **4.4. PATCH /agentes/{id}**

Atualiza informações parciais.

#### 📨 Request

```json
{
  "cargo": "Chefe Médico"
}
```

#### 📤 Response (200)

```json
{
  "id": 1,
  "nome": "Dra. Camila Nunes",
  "cargo": "Chefe Médico",
  "registro_profissional": "CRM-SP-456789",
  "data_admissao": "2022-10-05"
}
```

---

### **4.5. DELETE /agentes/{id}**

Remove permanentemente um agente.

#### 📤 Response (204)

```
Sem conteúdo
```

---

## 📋 **5. Endpoints de Relatórios Clínicos**

---

### **5.1. POST /relatorios**

Cria um novo relatório clínico.

#### 📨 Request

```json
{
  "id_paciente": 1,
  "id_agente": 1,
  "observacao": "Paciente apresentou febre leve e dor de cabeça.",
  "completo": false
}
```

#### 📤 Response (201)

```json
{
  "id": 1,
  "id_paciente": 1,
  "id_agente": 1,
  "observacao": "Paciente apresentou febre leve e dor de cabeça.",
  "data_registro": "2025-10-21T14:35:00Z",
  "completo": false
}
```

---

### **5.2. GET /relatorios/{id}**

Retorna um relatório específico.

#### 📤 Response (200)

```json
{
  "id": 1,
  "id_paciente": 1,
  "id_agente": 1,
  "observacao": "Paciente apresentou febre leve e dor de cabeça.",
  "data_registro": "2025-10-21T14:35:00Z",
  "completo": false
}
```

---

### **5.3. GET /pacientes/{id}/relatorios**

Lista todos os relatórios de um paciente.

#### 📤 Response (200)

```json
[
  {
    "id": 1,
    "id_paciente": 1,
    "id_agente": 1,
    "observacao": "Paciente apresentou febre leve e dor de cabeça.",
    "data_registro": "2025-10-21T14:35:00Z",
    "completo": false
  },
  {
    "id": 2,
    "id_paciente": 1,
    "id_agente": 2,
    "observacao": "Melhora clínica após uso de medicação.",
    "data_registro": "2025-10-22T09:20:00Z",
    "completo": true
  }
]
```

---

### **5.4. PATCH /relatorios/{id}**

Atualiza observações ou o status de conclusão.

#### 📨 Request

```json
{
  "observacao": "Paciente evoluiu bem após medicação.",
  "completo": true
}
```

#### 📤 Response (200)

```json
{
  "id": 1,
  "id_paciente": 1,
  "id_agente": 1,
  "observacao": "Paciente evoluiu bem após medicação.",
  "data_registro": "2025-10-21T14:35:00Z",
  "completo": true
}
```

---

### **5.5. GET /relatorios/pendentes**

Lista relatórios ainda não concluídos.

#### 📤 Response (200)

```json
[
  {
    "id": 3,
    "id_paciente": 2,
    "id_agente": 1,
    "observacao": "Em observação pós-operatória.",
    "data_registro": "2025-10-20T16:00:00Z",
    "completo": false
  }
]
```

---

## 🧾 **6. Resumo Técnico**

| Entidade              | Endpoints | Acesso            |
| :-------------------- | :-------- | :---------------- |
| **Paciente**          | 9         | Público e agentes |
| **Agente de Saúde**   | 5         | Agentes           |
| **Relatório Clínico** | 5         | Agentes           |

---

Deseja que eu gere esse README em **formato `.md` pronto para commit** (com sintaxe de Markdown e identação correta)?
Posso gerar e te entregar o arquivo direto (`README.md`).
