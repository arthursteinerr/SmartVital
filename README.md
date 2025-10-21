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

---

### 👤 **Paciente**

Entidade que representa um paciente no sistema.

| Campo              | Tipo   | Descrição                                                                                       |
| :----------------- | :----- | :---------------------------------------------------------------------------------------------- |
| `id`               | number | Identificador único do paciente. Esse campo é gerado automaticamente pelo sistema.              |
| `nome`             | string | Nome completo do paciente.                                                                      |
| `idade`            | number | Idade do paciente, expressa em anos completos.                                                  |
| `peso`             | number | Peso do paciente, medido em quilogramas (kg).                                                   |
| `altura`           | number | Altura do paciente, medida em metros (m).                                                       |
| `temperatura`      | number | Temperatura corporal do paciente, medida em graus Celsius (°C).                                 |
| `indice_glicemico` | number | Nível de glicose no sangue do paciente, em miligramas por decilitro (mg/dL).                    |
| `pressao_arterial` | string | Pressão arterial do paciente, no formato `"sistólica/diastólica"`, como por exemplo `"120/80"`. |
| `saturacao`        | number | Saturação de oxigênio no sangue do paciente, expressa em porcentagem (%).                       |
| `pulso`            | number | Frequência cardíaca do paciente, medida em batimentos por minuto (bpm).                         |
| `respiracao`       | number | Frequência respiratória do paciente, medida em respirações por minuto (rpm).                    |

---

### 👤 **Agente de Saúde**

Entidade que representa um profissional de saúde no sistema, como médicos, enfermeiros e outros.

| Campo                   | Tipo   | Descrição                                                                                                    |
| :---------------------- | :----- | :----------------------------------------------------------------------------------------------------------- |
| `id`                    | number | Identificador único do agente de saúde. Esse campo é gerado automaticamente pelo sistema.                    |
| `nome`                  | string | Nome completo do agente de saúde.                                                                            |
| `senha`                 | string | Senha ou credencial de acesso do agente para autenticação no sistema. (Deve ser armazenada de forma segura). |
| `cargo`                 | string | Cargo ou função do agente de saúde, por exemplo: `"Médico"`, `"Enfermeiro"`, `"Fisioterapeuta"`.             |
| `registro_profissional` | string | Registro profissional do agente, como CRM (para médicos), COREN (para enfermeiros), etc.                     |
| `data_admissao`         | string | Data de admissão do agente no sistema, no formato ISO (`YYYY-MM-DD`).                                        |

---

### 📄 **Relatório Clínico**

Entidade usada para registrar observações clínicas feitas por um agente de saúde sobre um paciente. Relatórios podem ser completos ou pendentes.

| Campo           | Tipo    | Descrição                                                                                              |
| :-------------- | :------ | :----------------------------------------------------------------------------------------------------- |
| `id`            | number  | Identificador único do relatório clínico. Esse campo é gerado automaticamente pelo sistema.            |
| `id_paciente`   | number  | ID do paciente associado ao relatório clínico. Este campo faz referência ao ID do paciente no sistema. |
| `id_agente`     | number  | ID do agente de saúde que gerou o relatório. Esse campo faz referência ao ID do agente no sistema.     |
| `observacao`    | string  | Descrição detalhada sobre o estado de saúde do paciente, observações clínicas feitas pelo agente.      |
| `data_registro` | string  | Data e hora de criação do relatório, no formato ISO (`YYYY-MM-DDTHH:mm:ssZ`).                          |
| `completo`      | boolean | Indicador que define se o relatório está completo (`true`) ou se ainda está pendente (`false`).        |

---

## 👥 **3. Endpoints de Pacientes**

---

### **3.1. POST /pacientes**

Cria um novo paciente no sistema.

#### 📨 **Request**

Solicita a criação de um novo paciente com os seguintes dados:

```json
{
  "id": 1,
  "nome": "Henrique Pereira",
  "idade": 30,
  "peso": 75.0,
  "altura": 1.70,
  "temperatura":
  "indice_glicemico": 
  "pressao_arterial": 
  "saturacao": 
  "pulso": 
  "respiracao": 
}
```

**Campos Preenchidos:**

* `nome` (string): Nome completo do paciente.
* `idade` (inteiro): Idade do paciente em anos.
* `peso` (decimal): Peso do paciente em quilogramas.
* `altura` (decimal): Altura do paciente em metros.

#### 📤 **Response (201)**

A resposta retorna os dados do paciente criado, incluindo o ID gerado automaticamente e os campos de sinais vitais (que estarão `null` até serem preenchidos).

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

Obtém uma lista de todos os pacientes registrados no sistema.

#### 📤 **Response (200)**

A resposta retorna uma lista com os pacientes cadastrados, com informações como nome, idade, peso e sinais vitais.

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

Busca as informações detalhadas de um paciente específico, identificado pelo seu `id`.

#### 📤 **Response (200)**

Retorna os dados completos do paciente, incluindo informações básicas e sinais vitais atualizados, se disponíveis.

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

Atualiza **todos os campos** de um paciente específico, incluindo dados pessoais e sinais vitais.

#### 📨 **Request**

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

**Campos:**

* `nome`, `idade`, `peso`, `altura`: Dados pessoais do paciente.
* `temperatura`, `indice_glicemico`, `pressao_arterial`, `saturacao`, `pulso`, `respiracao`: Sinais vitais atualizados.

#### 📤 **Response (200)**

A resposta retorna os dados atualizados do paciente.

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

Atualiza **somente o peso** do paciente.

#### 📨 **Request**

```json
{
  "peso": 77.3
}
```

#### 📤 **Response (200)**

Retorna o paciente com o peso atualizado.

```json
{
  "id": 1,
  "peso": 77.3
}
```

---

### **3.6. PATCH /pacientes/{id}/idade**

Atualiza **somente a idade** do paciente.

#### 📨 **Request**

```json
{
  "idade": 32
}
```

#### 📤 **Response (200)**

Retorna o paciente com a idade atualizada.

```json
{
  "id": 1,
  "idade": 32
}
```

---

### **3.7. PATCH /pacientes/{id}/pressao**

Atualiza **somente a pressão arterial** do paciente.

#### 📨 **Request**

```json
{
  "pressao_arterial": "125/83"
}
```

#### 📤 **Response (200)**

Retorna o paciente com a pressão arterial atualizada.

```json
{
  "id": 1,
  "pressao_arterial": "125/83"
}
```

---

### **3.8. GET /pacientes/{id}/sinais-vitais**

Retorna **somente os sinais vitais** do paciente, sem dados pessoais.

#### 📤 **Response (200)**

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

Remove permanentemente um paciente do sistema.

#### 📤 **Response (204)**

Sem conteúdo.

```
Sem conteúdo
```

---

## 👤 **4. Endpoints de Agentes de Saúde**

---

### **4.1. POST /agentes**

Cria um novo agente de saúde no sistema.

#### 📨 **Request**

```json
{
  "nome": "Dra. Camila Nunes",
  "senha": "12345",
  "cargo": "Médico",
  "registro_profissional": "CRM-SP-456789",
  "data_admissao": "2022-10-05"
}
```

**Campos:**

* `nome`: Nome completo do agente.
* `senha`: Senha para acesso ao sistema (utilize um mecanismo de segurança para criptografar a senha).
* `cargo`: Cargo do agente (ex: Médico, Enfermeiro, etc.).
* `registro_profissional`: Registro profissional (ex: CRM, COREN).
* `data_admissao`: Data de admissão do agente.

#### 📤 **Response (201)**

Retorna o agente recém-criado.

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

Lista todos os agentes de saúde registrados.

#### 📤 **Response (200)**

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

Retorna as informações de um agente específico.

#### 📤 **Response (200)**

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

Atualiza **informações parciais


** de um agente (como cargo ou dados pessoais).

#### 📨 **Request**

```json
{
  "cargo": "Chefe Médico"
}
```

#### 📤 **Response (200)**

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

Remove permanentemente um agente de saúde do sistema.

#### 📤 **Response (204)**

Sem conteúdo.

```
Sem conteúdo
```

---

## 📋 **5. Endpoints de Relatórios Clínicos**

---

### **5.1. POST /relatorios**

Cria um novo relatório clínico associando um paciente e um agente de saúde.

#### 📨 **Request**

```json
{
  "id_paciente": 1,
  "id_agente": 1,
  "observacao": "Paciente apresentou febre leve e dor de cabeça.",
  "completo": false
}
```

**Campos:**

* `id_paciente`: ID do paciente associado ao relatório.
* `id_agente`: ID do agente de saúde que está criando o relatório.
* `observacao`: Descrição das observações clínicas sobre o paciente.
* `completo`: Indica se o relatório foi concluído (`true`) ou se ainda está em andamento (`false`).

#### 📤 **Response (201)**

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

Retorna os detalhes de um relatório clínico específico.

#### 📤 **Response (200)**

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

Lista todos os relatórios clínicos associados a um paciente específico.

#### 📤 **Response (200)**

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

Atualiza observações ou o status de conclusão de um relatório clínico.

#### 📨 **Request**

```json
{
  "observacao": "Paciente evoluiu bem após medicação.",
  "completo": true
}
```

#### 📤 **Response (200)**

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

Lista todos os relatórios clínicos ainda não concluídos (`completo: false`).

#### 📤 **Response (200)**

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
