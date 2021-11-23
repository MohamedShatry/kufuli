# Kufuli Password Manager

## How to get started

To get started with Kufuli, run the following commands sequentially:

```other
git clone https://github.com/MohamedShatry/kufuli.git
cd kufuli
yarn
```

Once this is done, you’ll have successfully installed the extension.

## Previewing the extension

To preview the extension, you’ll need to run : `yarn build` , which will create a folder called `dist`. Once this folder is created, navigate to `chrome://extensions` in the navigation bar, and click “Load Unpacked” , and select the `dist` folder. You should then be able to view the extension in your browser.

![extension.png](https://res.craft.do/user/full/6f434951-d52e-fab1-8705-74e426ca6e13/doc/1C2679F2-7F20-4DDC-8B55-347D247A49A8/804DE220-1866-4A6C-AA9D-B362AAD35981_2/extension.png)

## Making changes

We use [Mantine](https://mantine.dev/) as our component library, please refer to it for documentation on building the UI.

Every time you make changes, you have to run `yarn build` and reload the extension to view the changes.
