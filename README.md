![Logo do Projeto](SmartVital.png)

Esta API foi desenvolvida para fornecer uma interface simples e robusta para o gerenciamento de perfis de usuários e o monitoramento de suas métricas vitais e relatórios de status.

## 1\. Visão Geral e Especificações

| Detalhe | Especificação |
| :--- | :--- |
| **Arquitetura** | RESTful |
| **Formato de Dados** | JSON (JSON) |
| **Códigos de Sucesso** | `200 OK`, `201 Created`, `204 No Content` |
| **Códigos de Erro** | `400 Bad Request`, `404 Not Found` |

### Estrutura das Entidades

#### Entidade: Usuário

Gerencia dados demográficos, de acesso e as medições vitais mais recentes.

| Atributo | Tipo | Descrição | Notas |
| :--- | :--- | :--- | :--- |
| `id` | `number` (Integer) | Identificador único do usuário. | **Chave Primária** |
| `senha` | `string` | Senha de acesso. | Necessária para criação e atualizações de segurança. |
| `temperatura` | `number` (Decimal) | Temperatura corporal ($^\circ C$). | Ex: 36.5 |
| `indice_glicemico` | `number` (Decimal) | Nível de glicose (mg/dL). | Ex: 95.2 |
| `pressao_arterial` | `string` | Pressão arterial (sistólica/diastólica). | Ex: "120/80" |
| `saturacao` | `number` (Integer) | Saturação de oxigênio (%). | Ex: 98 |
| `pulso` | `number` (Integer) | Frequência de pulso (bpm). | Ex: 72 |
| `peso` | `number` (Decimal) | Peso em quilogramas (kg). | Ex: 80.5 |
| `idade` | `number` (Integer) | Idade do usuário. | Ex: 45 |
| `respiração` | `number` (Integer) | Taxa de respiração (rpm). | Ex: 16 |
| `altura` | `number` (Decimal) | Altura em metros (m). | Ex: 1.75 |

#### Entidade: Relatório

Gerencia o status de conclusão de um documento ou processo de saúde.

| Atributo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `number` (Integer) | Identificador único do relatório. |
| `id_usuario` | `number` (Integer) | ID do usuário associado. |
| `completo` | `boolean` | Status: `true` se o relatório estiver finalizado. |
| `incompleto` | `boolean` | Status: `true` se o relatório estiver pendente. |

-----

## 2\. Endpoints de Usuários (9 Ações)

#### 2.1 `POST /usuarios`

* **Cria um usuário** novo.
* **Body de exemplo**:

  ```json
  {
    "senha": "senhaSegura",
    "idade": 30,
    "peso": 75.0,
    "altura": 1.70
  }
  ```
* **Resposta (201 Created)**:

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
    "respiração": null
  }
  ```

---

#### 2.2 `GET /usuarios`

* **Lista todos os usuários**.
* **Resposta (200 OK)**:

  ```json
  [
    {
      "id": 1,
      "idade": 30,
      "peso": 75.0,
      "altura": 1.70,
      ...
    },
    {
      "id": 2,
      "idade": 45,
      "peso": 82.5,
      "altura": 1.80,
      ...
    }
  ]
  ```

---

#### 2.3 `GET /usuarios/{id}`

* **Retorna o perfil completo do usuário com aquele ID.**
* **Resposta (200 OK)**:

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
    "respiração": 16
  }
  ```

---

#### 2.4 `PUT /usuarios/{id}`

* **Atualiza completamente os dados do usuário.**
* **Body de exemplo**:

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
    "respiração": 17
  }
  ```
* **Resposta (200 OK)**: Objeto atualizado.

---

#### 2.5 `DELETE /usuarios/{id}`

* **Remove o usuário.**
* **Resposta (204 No Content)**: Nenhum conteúdo retornado.

---

#### 2.6 `GET /usuarios/{id}/vitals`

* **Retorna apenas os dados de saúde.**
* **Resposta (200 OK)**:

  ```json
  {
    "temperatura": 36.5,
    "indice_glicemico": 95.2,
    "pressao_arterial": "120/80",
    "saturacao": 98,
    "pulso": 72,
    "respiração": 16
  }
  ```

---

#### 2.7 `PATCH /usuarios/{id}/peso`

* **Atualiza apenas o peso**.
* **Body**:

  ```json
  {
    "peso": 78.0
  }
  ```
* **Resposta (200 OK)**:

  ```json
  {
    "mensagem": "Peso atualizado com sucesso."
  }
  ```

---

#### 2.8 `PATCH /usuarios/{id}/idade`

* **Atualiza apenas a idade.**
* **Body**:

  ```json
  {
    "idade": 35
  }
  ```
* **Resposta (200 OK)**:

  ```json
  {
    "mensagem": "Idade atualizada com sucesso."
  }
  ```

---

#### 2.9 `PATCH /usuarios/{id}/pressao`

* **Atualiza apenas a pressão arterial.**
* **Body**:

  ```json
  {
    "pressao_arterial": "130/85"
  }
  ```
* **Resposta (200 OK)**:

  ```json
  {
    "mensagem": "Pressão arterial atualizada com sucesso."
  }
  ```

---

### **Endpoints de Relatórios**

#### 3.1 `POST /relatorios`

* **Cria um novo relatório.**
* **Body de exemplo**:

  ```json
  {
    "id_usuario": 1,
    "completo": false,
    "incompleto": true
  }
  ```
* **Resposta (201 Created)**:

  ```json
  {
    "id": 10,
    "id_usuario": 1,
    "completo": false,
    "incompleto": true
  }
  ```

---

#### 3.2 `GET /relatorios/{id}`

* **Retorna status de um relatório específico.**
* **Resposta (200 OK)**:

  ```json
  {
    "id": 10,
    "id_usuario": 1,
    "completo": false,
    "incompleto": true
  }
  ```

---

#### 3.3 `GET /usuarios/{id}/relatorios`

* **Lista todos os relatórios do usuário.**
* **Resposta (200 OK)**:

  ```json
  [
    {
      "id": 10,
      "completo": false,
      "incompleto": true
    },
    {
      "id": 12,
      "completo": true,
      "incompleto": false
    }
  ]
  ```

---

#### 3.4 `PUT /relatorios/{id}/completo`

* **Marca como completo.**
* **Resposta (200 OK)**:

  ```json
  {
    "mensagem": "Relatório marcado como completo."
  }
  ```

---

#### 3.5 `PUT /relatorios/{id}/incompleto`

* **Marca como incompleto.**
* **Resposta (200 OK)**:

  ```json
  {
    "mensagem": "Relatório marcado como incompleto."
  }
  ```

---

#### 3.6 `GET /relatorios/pendentes`

* **Lista relatórios incompletos.**
* **Resposta (200 OK)**:

  ```json
  [
    {
      "id": 10,
      "id_usuario": 1,
      "completo": false,
      "incompleto": true
    }
  ]
  ```

---

### **Endpoints de Métricas e Consultas**

#### 4.1 `GET /metricas/contagem/usuarios`

* **Retorna número total de usuários.**
* **Resposta**:

  ```json
  {
    "total_usuarios": 52
  }
  ```

---

#### 4.2 `GET /metricas/media/peso`

* **Retorna média de peso.**
* **Resposta**:

  ```json
  {
    "media_peso": 74.3
  }
  ```

---

#### 4.3 `GET /metricas/maxima/temperatura`

* **Retorna maior temperatura registrada.**
* **Resposta**:

  ```json
  {
    "maxima_temperatura": 39.2
  }
  ```

---

#### 4.4 `GET /relatorios/contagem/completo`

* **Número de relatórios completos.**
* **Resposta**:

  ```json
  {
    "relatorios_completos": 28
  }
  ```

---

#### 4.5 `GET /usuarios/acimadaidade/{idade}`

* **Lista usuários com idade superior ao valor informado.**
* **Exemplo `/usuarios/acimadaidade/60`**
* **Resposta**:

  ```json
  [
    {
      "id": 4,
      "idade": 65,
      "peso": 70.2,
      "altura": 1.68,
      ...
    },
    {
      "id": 5,
      "idade": 72,
      "peso": 68.5,
      "altura": 1.65,
      ...
    }
  ]
  ```

---

