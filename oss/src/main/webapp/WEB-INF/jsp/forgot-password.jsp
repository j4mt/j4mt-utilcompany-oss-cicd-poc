<%@include file="includes/header.jsp"%>

<div class="main center">
	<div class="container">

		<%@include file="includes/left-nav.jsp" %>

		<div class="right-column">

			<div class="panel-heading">
				<h3 class="panel-title">Forgot password?</h3>
			</div>

			<div class="panel-body">

				<form:form modelAttribute="forgotPasswordForm" role="form">

					<form:errors />

					<div class="form-group">
						<form:label path="email">Email address</form:label>
						<form:input path="email" type="email" class="form-control" placeholder="Enter email" />
						<form:errors cssClass="error" path="email" />
						<p class="help-block">Please enter your email id</p>
					</div>

					<button type="submit" class="btn btn-default">Reset password</button>

				</form:form>
			</div>

		</div>
	</div>
</div>


<%@include file="includes/footer.jsp"%>
