provider "aws" {
  region = "ca-central-1"
}


variable "default_tags" {
  type        = map(string)
  default     = {
      description = "Do Not Edit: Managed by Terraform."
  }
}