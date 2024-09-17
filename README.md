# Liveblocks Splitting Editor Bug

## Installing
1. Download the repo locally `git clone git@github.com:francistogram/liveblocks-bug.git`
2. Create a `.env` and set `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY` with an API key from Liveblocks
3. Install dependencies `yarn`
4. Run the app `yarn dev`

## Reproducing the Bug
### Video Walkthrough
https://github.com/user-attachments/assets/6f4e8aaa-d6e5-4c78-88dd-06ce7d6cb6e1

### Working State / Expected Outcome
In the current state of the app if you go into the editor and type some words and then add 5 new lines between the words it'll split the editor at that point into two editors

### Broken State (Liveblocks is used)
First uncomment [these lines of code in Editor.tsx](https://github.com/francistogram/liveblocks-bug/blob/main/src/components/Editor.tsx#L65-L70)
You'll see the ability to add comments which means Liveblocks has been imported into the editor
If you try spitting the editor again you'll get an error
<img width="987" alt="image" src="https://github.com/user-attachments/assets/b6131ddf-d5c3-4662-877d-f7c44224b4ae">
