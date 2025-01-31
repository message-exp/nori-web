PROTOC_GEN_JS_PATH="node_modules/.bin/protoc-gen-js"
PROTOC_GEN_GRPC_WEB_PATH="path/to/protoc-gen-grpc-web"
PROTO_PATH="src/protos/"
OUT_DIR="src/proto-generated"
PROTO_TARGET="$(find src/protos/nori -name "*.proto")"

protoc \
    --proto_path="${PROTO_PATH}" \
    --plugin="protoc-gen-js=${PROTOC_GEN_JS_PATH}" \
    --plugin="protoc-gen-grpc-web=${PROTOC_GEN_GRPC_WEB_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --grpc-web_out=import_style=typescript,mode=grpcweb:${OUT_DIR} \
    ${PROTO_TARGET}
