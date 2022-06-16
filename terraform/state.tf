terraform {
  backend "local" {
    path = "/home/john/terraform-polyglot.tfstate"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}
