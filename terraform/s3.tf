resource "aws_s3_bucket" "polyglotvictoria" {
  bucket = "polyglotvictoria.ca"

  grant {
    permissions = ["READ",]
    type        = "Group"
    uri         = "http://acs.amazonaws.com/groups/global/AllUsers"
  }


  grant {
    id          = "a98ca8eea6f807a061d44ec7862bac0cfbfb0dc70e22a7ba542c8f5ca05dc611"
    permissions = ["FULL_CONTROL",]
    type        = "CanonicalUser"
  }

  versioning {
    enabled    = false
    mfa_delete = false
  }

  website {
    index_document = "index.html"
  }

  tags = merge(
    var.default_tags,
    {
      Name = "polyglotvictoria.ca"
    }
  )
}