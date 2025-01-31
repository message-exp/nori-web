PROTOC_GEN_TS_PATH="node_modules/.bin/protoc-gen-ts"
PROTOC_GEN_JS_PATH="node_modules/.bin/protoc-gen-js"
PROTO_PATH="src/protos/"
OUT_DIR="src/proto-generated"
PROTO_TARGET="$(find src/protos/nori -name "*.proto")"

protoc \
    --proto_path="${PROTO_PATH}" \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --plugin="protoc-gen-js=${PROTOC_GEN_JS_PATH}" \
    --js_out="import_style=es6,binary:${OUT_DIR}" \
    --ts_out="service=grpc-web:${OUT_DIR}" \
    ${PROTO_TARGET}
