# Bit FLip Viewport

This branch solely serves to outline the purpose of all of the other
branches in this repo. It lives here so as not to create bloat.

I recommend making a directory to store all of the necessary folders that
interact with one another. i.e.

```shell
mkdir capstone-project
cd capstone-project
```

## Branches

### main

Like most GitHub repos, this repo follows the traditional structure of a main
branch. This is the only branch, as I have since merged the development branch
into it and deleted the development branch. So, I _recommend_ the traditional
approach of creating feature and bug branches for development.

i.e.
- feature/firebase for work on transferring to Firebase hosting
- feature/nightly-batch for implementing a batch that manages stale users/tests
- bug/highlighting for the... bug with difference highlighting

This is also the best method for use on the eth-bit-flip repo before merging to
v#.#.#.

## Folder Structure

Not as much information here either, just kind of need to read through the code.

### client

This is the actual frontend React webapp that gets deployed.

### server

This is the `expressjs` API used by eth-bit-flip to push bit flip samples and
the webapp to query each users' tests and what not.

## Deployment to Firebase

We previously used Heroku but their free tier is being removed in October (?) so
my best recommendation would be to use Firebase instead. The frontend should not
be a huge concern presently so I'll work on this myself and update documentation
as needed.
