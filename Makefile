deploy:
	cd app; npm run build
	cd app; aws s3 sync build/ s3://polyglotmeetup.ca/
	cd app; aws cloudfront create-invalidation --distribution-id=E2TDU1M5WIS212 --paths=/index.html
