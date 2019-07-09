# Release Instructions


## Release Update

- Create version

1. Update `versionName` & `versionNumber` in `sfdx-project.json`
2. `npm run create-version`

- "promote" Version

1. Get `04txxxxxx` version from previous step
2. `sfdx force:package:version:promote -p 04txxxxxx`

- Update install instructions in readme

- Add release on github
