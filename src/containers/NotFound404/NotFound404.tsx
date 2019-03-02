import * as React from "react";

import PageHeader from "../../components/UI/PageHeader/PageHeader";
import Button from "../../components/UI/Button/Button";

class NotFound404 extends React.Component<{}, {}> {
  render(): JSX.Element {
    return (
      <div className="container pb-5 pt-lg-3">
        <PageHeader>Page Not Found</PageHeader>

        <p className="lead">Oops, it appears the page you were looking for does not exist.</p>

        <div className="text-center">
          <Button kind="link" to="/" theme="secondary">
            Go Home <i className="fa fa-home" />
          </Button>
        </div>
      </div>
    );
  }
}

export default NotFound404;
