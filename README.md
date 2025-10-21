![Logo do Projeto](src/img/ImagemProjeto\(SmartVitals\).png)

# 🩺 **SmartVital API**

A **SmartVital API** é uma aplicação RESTful projetada para o **monitoramento de pacientes**, **gestão de profissionais de saúde** e **emissão de relatórios clínicos** de forma digital e segura.

Voltada a **hospitais, UTIs e clínicas**, a SmartVital possibilita:

* **Gerenciamento centralizado de dados médicos**,
* **Padronização de informações clínicas**,
* **Agilidade e confiabilidade no atendimento**.

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

O modelo de dados é composto por três entidades principais: **Paciente**, **Agente de Saúde** e **Relatório Clínico**.

Cada uma representa um componente essencial do sistema SmartVital e segue boas práticas de normalização e rastreabilidade.

---

### 👤 **Paciente**

Entidade que representa um paciente no sistema.

| Campo              | Tipo   | Descrição                                                             |
| :----------------- | :----- | :-------------------------------------------------------------------- |
| `id`               | number | Identificador único do paciente (gerado automaticamente).             |
| `nome`             | string | Nome completo do paciente.                                            |
| `idade`            | number | Idade do paciente (em anos completos).                                |
| `peso`             | number | Peso corporal em quilogramas (kg).                                    |
| `altura`           | number | Altura em metros (m).                                                 |
| `temperatura`      | number | Temperatura corporal (°C).                                            |
| `indice_glicemico` | number | Nível de glicose no sangue (mg/dL).                                   |
| `pressao_arterial` | string | Pressão arterial no formato `"sistólica/diastólica"`, ex: `"120/80"`. |
| `saturacao`        | number | Saturação de oxigênio no sangue (%).                                  |
| `pulso`            | number | Frequência cardíaca (bpm).                                            |
| `respiracao`       | number | Frequência respiratória (rpm).                                        |

---

### 🧑‍⚕️ **Agente de Saúde**

Representa médicos, enfermeiros ou outros profissionais.

| Campo                   | Tipo   | Descrição                                                             |
| :---------------------- | :----- | :-------------------------------------------------------------------- |
| `id`                    | number | Identificador único do agente (gerado automaticamente).               |
| `nome`                  | string | Nome completo do profissional.                                        |
| `senha`                 | string | Credencial de acesso (armazenada de forma segura).                    |
| `cargo`                 | string | Função exercida, como `"Médico"`, `"Enfermeiro"`, `"Fisioterapeuta"`. |
| `registro_profissional` | string | Registro profissional (CRM, COREN, etc.).                             |
| `data_admissao`         | string | Data de admissão no formato ISO (`YYYY-MM-DD`).                       |

---

### 📄 **Relatório Clínico**

Armazena observações médicas registradas por agentes sobre pacientes.

| Campo           | Tipo    | Descrição                                                                          |
| :-------------- | :------ | :--------------------------------------------------------------------------------- |
| `id`            | number  | Identificador único do relatório.                                                  |
| `id_paciente`   | number  | ID do paciente associado (FK de `pacientes`).                                      |
| `id_agente`     | number  | ID do agente de saúde que criou o relatório (FK de `agentes`).                     |
| `observacao`    | string  | Texto descritivo sobre o estado clínico do paciente.                               |
| `data_registro` | string  | Data/hora de criação no formato ISO (`YYYY-MM-DDTHH:mm:ssZ`).                      |
| `completo`      | boolean | Indica se o relatório foi concluído (`true`) ou ainda está em andamento (`false`). |

---

## 🧱 **3. Modelo Entidade-Relacionamento (MER) - SmartVital**

O modelo **SmartVital** foi projetado com **três entidades principais** e **relacionamentos 1:N** entre pacientes, agentes e relatórios.

| Entidade      | Chave Primária       | Atributos Principais                                                                    |
| :------------ | :------------------- | :-------------------------------------------------------------------------------------- |
| **Paciente**  | `id_paciente` (INT)  | `nome`, `idade`, `peso`, `altura`, `temperatura`, `pressao_arterial`, `saturacao`, etc. |
| **Agente**    | `id_agente` (INT)    | `nome`, `cargo`, `registro_profissional`, `data_admissao`.                              |
| **Relatorio** | `id_relatorio` (INT) | `data_registro`, `completo`, `observacao`.                                              |

### 🔗 **Relacionamentos e Cardinalidades**

1. **Paciente ⇄ Relatorio (1:N)**

   * Um **Paciente** possui **um ou vários Relatórios** (`1:N`).
   * Cada **Relatório** pertence a **um único Paciente** (`N:1`).

2. **Agente ⇄ Relatorio (1:N, com participação opcional)**

   * Um **Agente** pode emitir **um ou vários Relatórios** (`1:N`).
   * Um **Relatório** pode ou não ter um agente associado (`0:N`), permitindo relatórios automáticos ou pendentes.

### 🧩 **Implementação Relacional**

* **Tabelas principais:** `pacientes`, `agentes`, `relatorios`.
* **Chaves estrangeiras:**

  * `relatorios.id_paciente` → `pacientes.id` (**obrigatória**)
  * `relatorios.id_agente` → `agentes.id` (**opcional / NULL permitido**)
* **Integridade referencial garantida** por restrições de chave estrangeira (FK).
* **Remoção em cascata** pode ser aplicada ao deletar um paciente, se desejado.

---

## 👥 **4. Endpoints de Pacientes**

---

### **4.1. POST /pacientes**

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

### **4.2. GET /pacientes**

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

### **4.3. GET /pacientes/{id}**

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

### **4.4. PUT /pacientes/{id}**

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

### **4.5. PATCH /pacientes/{id}/peso**

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

### **4.6. PATCH /pacientes/{id}/idade**

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

### **4.7. PATCH /pacientes/{id}/pressao**

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

### **4.8. GET /pacientes/{id}/sinais-vitais**

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

### **4.9. DELETE /pacientes/{id}**

Remove permanentemente um paciente do sistema.

#### 📤 **Response (204)**

Sem conteúdo.

```
Sem conteúdo
```

---

## 👤 **5. Endpoints de Agentes de Saúde**

---

### **5.1. POST /agentes**

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

### **5.2. GET /agentes**

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

### **5.3. GET /agentes/{id}**

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

### **5.4. PATCH /agentes/{id}**

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

### **5.5. DELETE /agentes/{id}**

Remove permanentemente um agente de saúde do sistema.

#### 📤 **Response (204)**

Sem conteúdo.

```
Sem conteúdo
```

---

## 📋 **6. Endpoints de Relatórios Clínicos**

---

### **6.1. POST /relatorios**

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

### **6.2. GET /relatorios/{id}**

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

### **6.3. GET /pacientes/{id}/relatorios**

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

### **6.4. PATCH /relatorios/{id}**

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

### **6.5. GET /relatorios/pendentes**

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

## 🧾 **7. Resumo Técnico**

| Entidade              | Endpoints | Acesso            |
| :-------------------- | :-------- | :---------------- |
| **Paciente**          | 9         | Público e agentes |
| **Agente de Saúde**   | 5         | Agentes           |
| **Relatório Clínico** | 5         | Agentes           |

---
