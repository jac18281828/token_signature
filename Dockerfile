ARG VERSION=latest
FROM jac18281828/tsdev:${VERSION}

ARG PROJECT=token_signature
WORKDIR /workspaces/${PROJECT}
RUN chown -R jac.jac .

COPY --chown=jac:jac package.json .
COPY --chown=jac:jac yarn.lock .
RUN yarn install --save-dev

USER jac

COPY --chown=jac:jac . .

RUN yarn prettier:check
RUN yarn eslint
#RUN yarn build

CMD yarn start

