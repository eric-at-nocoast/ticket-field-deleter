# Delete Zendesk ticket fields in bulk

# DISCLAIMER

### This script has the ability to make major changes to your Zendesk instance via deleting ticket fields.

### This is not supported by Zendesk Use with caution and at your own risk.

---

<!-- Description of project-->

This script loops through all of your ticket fields finding all that match the created_at date & title deleting them

## Getting started

​
Follow these steps to get a local copy up and running.
​

<!-- Any required packages or dependencies prior to installation of the app-->

### Prerequisites

​

- npm

```
npm install npm@latest -g
```

<!-- Steps to get the app running locally -->

### Installation

1. Clone the repo

```git
git clone https://github.com/eric-at-zd/ticket-field-deleter
```

2. Install dependancies

```javascript
npm install
```

3. Copy the .env.example file into an .env

4. Replace placeholder values in the .env file with one's relevant to your account

5. Put the date you'd like to match in the matchDate field on line 52

```javascript
    let matchDate = "2022-01-17";
```

6. Put the titles you'd like to match in the matchTitleArr array on line 54

```javascript
    let matchTitleArr = ["example field 1", "example field 2"];
```

7. Run the script

```javascript
npm run start
```

​
