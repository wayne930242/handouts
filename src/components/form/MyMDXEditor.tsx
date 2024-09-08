"use client";

import React from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  imagePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  tablePlugin,
  InsertTable,
  DiffSourceToggleWrapper,
  linkPlugin,
  linkDialogPlugin,
  diffSourcePlugin,
  Separator,
  ListsToggle,
  InsertImage,
  ImageUploadHandler,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export const MyMDXEditor = React.forwardRef<
  MDXEditorMethods,
  MDXEditorProps & {
    oldMarkdown?: string;
    imageUploadHandler?: ImageUploadHandler;
  }
>((props, ref) => {
  const { plugins, oldMarkdown, imageUploadHandler, ...rest } = props;

  return (
    <div className="rounded-md border border-input bg-background w-full">
      <MDXEditor
        plugins={[
          diffSourcePlugin({
            diffMarkdown: oldMarkdown ?? "",
            viewMode: "rich-text",
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                {"  "}
                <DiffSourceToggleWrapper>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <ListsToggle />
                  <Separator />
                  <InsertTable />
                  <InsertImage />
                </DiffSourceToggleWrapper>
              </>
            ),
          }),
          tablePlugin(),
          headingsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          listsPlugin(),
          quotePlugin(),
          imagePlugin({
            imageUploadHandler,
          }),
          markdownShortcutPlugin(),
          ...(plugins ?? []),
        ]}
        contentEditableClassName="prose max-w-screen-2xl bg-white"
        ref={ref}
        {...rest}
      />
    </div>
  );
});

MyMDXEditor.displayName = "MyMDXEditor";

export default MyMDXEditor;
