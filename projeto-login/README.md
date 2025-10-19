# Projeto Sistema de Login (Flask)

Este é um projeto simples de sistema de login e registro de usuários construído com o framework web Flask em Python. Ele utiliza um banco de dados SQLite (`users.db`) para armazenar as informações dos usuários.

## Funcionalidades

* Registro de novos usuários (nome de usuário e senha).
* Login de usuários existentes.
* Página de dashboard (`dashboard.html`) simples acessível apenas para usuários logados.
* Logout.

## Tecnologias Utilizadas

* **Python 3**
* **Flask:** Framework web.
* **Flask-SQLAlchemy:** (Provavelmente) Para interação com o banco de dados.
* **Flask-Login:** (Provavelmente) Para gerenciar sessões de usuário.
* **SQLite:** Banco de dados relacional leve (`users.db`).
* **HTML/CSS (Templates Jinja2):** Para a interface do usuário.

## Estrutura do Projeto

* `app.py`: Arquivo principal da aplicação Flask.
* `instance/users.db`: Banco de dados SQLite onde os usuários são armazenados. (Esta pasta `instance` é ignorada pelo `.gitignore`).
* `templates/`: Contém os arquivos HTML para as páginas:
    * `base.html`: Template base.
    * `login.html`: Página de login.
    * `register.html`: Página de registro.
    * `dashboard.html`: Página exibida após o login.
* `.venv/`: Pasta do ambiente virtual (ignorada pelo `.gitignore`).
* `requirements.txt`: Lista das dependências Python.

## Instalação e Execução

1.  **Navegue até a pasta do projeto:**
    ```bash
    cd caminho/para/Projetos-Pessoais/projeto-login
    ```

2.  **Crie e ative um ambiente virtual:**
    ```bash
    # Se ainda não existir
    python -m venv .venv 
    
    # Ative (Windows)
    .\.venv\Scripts\activate
    ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Execute a aplicação Flask:**
    ```bash
    flask run
    # Ou python app.py (depende de como seu app.py está configurado)
    ```

5.  Abra seu navegador e acesse o endereço fornecido (geralmente `http://127.0.0.1:5000`).