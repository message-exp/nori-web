import type { IContent } from "matrix-js-sdk";

// reference: https://spec.matrix.org/v1.14/client-server-api/#mroommessage-msgtypes

export default function TextMessage({ content }: { content: IContent }) {
  return content.format === "org.matrix.custom.html" &&
    content.formatted_body ? (
    // TODO: limit HTML tags
    <div
      className="text-sm break-words"
      dangerouslySetInnerHTML={{
        __html: content.formatted_body,
      }}
    />
  ) : (
    <div className="text-sm break-words">{content.body}</div>
  );
}
