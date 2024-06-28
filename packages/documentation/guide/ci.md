# Continuous integration

This guide explains how to set up continuous integration (CI) for Acronis UI component Library.

## Run GitHub Actions locally

To run GitHub Actions locally, you can use the [act](https://nektosact.com/)
tool. This tool allows you to run GitHub Actions locally.

To install `act`, you can use the following command:

```bash
brew install act
```

To output the GitHub Actions workflow, you can use the following command:

```bash     
act -l
```

To run the GitHub Actions locally, you can use the following command:

```bash
act -j <job_name>
```
