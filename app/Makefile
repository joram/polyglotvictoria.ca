deploy:
	npm run build
	aws s3 sync build/ s3://polyglotmeetup.ca/
	aws cloudfront create-invalidation --distribution-id=E2TDU1M5WIS212 --paths=/index.html
