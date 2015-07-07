# Motivation #

Developers should be sharing their work in feature branches. These branches are meant to be disposable: they can be abandoned easily if ideas do not pan out. To prevent the overgrowth of branches in the official repository, instructions for sharing branches are outlined below.

# Instructions #

This setup should be performed on a remote machine to which you and everyone you intend to share with has access. The department's Sun machine, sun.cs.tamu.edu, is a good choice.

1. Clone the official repositoy

```
$ git clone ssh://<username>@umbrella.cs.tamu.edu/research/parasol-svn/svnrepository/jarvigit/property-models hotdrink
```

2. Make the repository readable

```
$ chmod -R go+rX hotdrink
```

3. Your home directory on sun, by default, is not accessible to outsiders. You will need to make the path to your shared repository readable and executable. For each directory from your home to the repository,

```
$ chmod go+rX .
```

4. Give your partner a link to your repository. For Sun, it would be something like this:

```
ssh://sun.cs.tamu.edu/home/path/to/user/git/hotdrink
```

5. They should add your repository as a remote and fetch.