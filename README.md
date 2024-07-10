# HeraUI

This is a UI library (currently in beta) created on top of `react-aria-components` and `TailwindCSS`.

## Usage

Use our CLI! Choose your favorite package manager and run this in the root of your project
```sh
# Faster with bun runtime
bunx --bun hera init
bunx --bun hera add [component]

# Default with npm and node
npx hera init
npx hera add [component]
```

You can also copy and paste the component you want from the `ui` folder.

#### Dark mode

You need to add this property in your tailwind config if you wish to control the dark mode

```js
darkMode: "class",
```

⚙️ Feel free to replace _(in Avatar & Text)_ the `<img>` and `<a>` with your framework's implementation.

## Documentation

Coming soon..

```js
<main className="ml-4">
  <DarkModeToggle />
  <Avatar className="size-10" sizes="40px" src="https://avatars.githubusercontent.com/u/10660468?v=4" />
  <Badge color="red">admin</Badge>

  <Heading>Dashboard</Heading>
  <Heading level={2}>Example</Heading>
  <Heading level={3}>Button colors</Heading>
  <Text>
    This feature is only available to users on the <Strong>Business Plan</Strong>. To upgrade your plan, visit your{" "}
    <TextLink href="/settings">billing settings</TextLink>.
  </Text>
  <Text>
    Your new API token is <Code>BaVrRKpRMS_ndKU</Code>. Store this token somewhere safe as it will only be displayed
    once.
  </Text>

  <div className="flex gap-x-4">
    <DialogTest />
    <AlertTest />
  </div>

  <form action={signInCredentials} className="flex w-1/2 flex-col gap-y-3">
    <FieldSet>
      <Label>Name</Label>
      <Input name="test" />
      <Text as="description">This is a description</Text>
    </FieldSet>

    <FieldSet>
      <Label>Textarea</Label>
      <TextArea name="test" />
    </FieldSet>

    <FieldSet>
      <Label>Selection</Label>
      <Select label="selection">
        <Option>Active</Option>
        <Option>Paused</Option>
      </Select>
    </FieldSet>

    <FieldSet aria-label="discoverability">
      <Legend>Discoverability</Legend>
      <Text>Decide where your events can be found across the web.</Text>
      <CheckboxGroup>
        <CheckboxField>
          <Checkbox name="discoverability" value="show_on_events_page" />
          <Label>Show on events page</Label>
          <Text as="description">Make this event visible on your profile.</Text>
        </CheckboxField>
        <CheckboxField isDisabled>
          <Checkbox name="discoverability" value="allow_embedding" />
          <Label>Allow embedding</Label>
          <Text as="description">Allow others to embed your event details on their own site.</Text>
        </CheckboxField>
      </CheckboxGroup>
    </FieldSet>

    <FieldSet aria-label="resale_transfers">
      <Legend>Resale and transfers</Legend>
      <Text>Decide if people buy tickets from you or from scalpers.</Text>
      <RadioGroup name="resale" defaultValue="permit" aria-label="resale">
        <RadioField>
          <Radio value="permit" />
          <Label>Allow tickets to be resold</Label>
          <Text as="description">
            Customers can resell or transfer their tickets if they can’t make it to the event.
          </Text>
        </RadioField>
        <RadioField>
          <Radio value="forbid" />
          <Label>Don’t allow tickets to be resold</Label>
          <Text as="description">Tickets cannot be resold or transferred to another person.</Text>
        </RadioField>
      </RadioGroup>
    </FieldSet>

    <Button type="submit">Submit</Button>

    <Skeleton className="size-10 rounded-full" />
  </form>
</main>
```

## License

Licensed under the [MIT license](https://github.com/Sawangg/heraUI/blob/main/LICENSE).
