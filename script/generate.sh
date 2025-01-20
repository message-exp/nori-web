# Path to this plugin, Note this must be an abolsute path on Windows (see #15)
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
# Path to the grpc_node_plugin
PROTOC_GEN_GRPC_PATH="./node_modules/.pnpm/grpc-tools@1.12.4/node_modules/grpc-tools/bin/grpc_node_plugin"
OUT_DIR="./src/generated"
PROTOCS_FOLDER="./src/protos/nori/v0/"
protoc \
    --proto_path="./src/protos/" \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --plugin="protoc-gen-grpc=${PROTOC_GEN_GRPC_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=grpc-node,mode=grpc-js:${OUT_DIR}" \
    ${PROTOCS_FOLDER}/*.proto
