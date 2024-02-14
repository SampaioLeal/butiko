<center>

![Logo](https://img.pikbest.com/element_our/20220405/bg/1c936d8b550cd.png!bw700)

</center>

# Butiko

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

Build kubernetes resources easily

![Butiko Asciinema](/butiko.gif)

## Features

- Create multiple environments with the `variables` list
- Reuse manifests in various projects with the `imports` list
- Define the namespace to all manifests in one place with the `namespace` keyword

## Installing

```bash
curl -fsSL https://raw.githubusercontent.com/SampaioLeal/butiko/main/install.sh | sh
```

## Usage

```shell
butiko build ./examples/simple/butiko.yaml
```

The results will be like:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: myapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: "registry.mycompany/myapp:latest"
          resources:
            requests:
              memory: 50Mi
              cpu: 100m
            limits:
              memory: 128Mi
              cpu: 500m
          ports:
            - containerPort: 3000

---
apiVersion: v1
kind: Service
metadata:
  name: myapp
  namespace: myapp
# ..........
# ..........
# ..........
```

## Roadmap

- Use [cliffy](https://deno.land/x/cliffy@v1.0.0-rc.3)
- Support URL imports
- Support other systems and archs

<!--
## FAQ

#### Questão 1

Resposta 1

#### Questão 2

Resposta 2 -->

## Feedback

Feedbacks are welcome through [issues](https://github.com/SampaioLeal/butiko/issues)

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Appendix

[@SampaioLeal](https://www.github.com/SampaioLeal) (the author) dedicates this project to his wife 💖 L.N 💖 that inspired the name of the project.
