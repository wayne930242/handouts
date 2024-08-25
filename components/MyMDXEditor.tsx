"use client";

import React from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
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
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export const MyMDXEditor = React.forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => {
    const { plugins, ...rest } = props;

    return (
      <div className="rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full">
        <MDXEditor
          plugins={[
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  {"  "}
                  <DiffSourceToggleWrapper>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <InsertTable />
                  </DiffSourceToggleWrapper>
                </>
              ),
            }),
            tablePlugin(),
            headingsPlugin(),
            linkPlugin(),
            linkDialogPlugin({
              linkAutocompleteSuggestions: [
                "https://virtuoso.dev",
                "https://mdxeditor.dev",
              ],
            }),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            ...(plugins ?? []),
          ]}
          contentEditableClassName="prose"
          ref={ref}
          {...rest}
        />
      </div>
    );
  }
);

MyMDXEditor.displayName = "MyMDXEditor";

export default MyMDXEditor;
