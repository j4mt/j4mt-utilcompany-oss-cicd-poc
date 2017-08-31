<%@include file="includes/header.jsp" %>

<div class="main center">
    <div class="container">

        <%@include file="includes/left-nav.jsp" %>

        <div class="right-column">


            <div class="panel-heading">
                <h3 class="panel-title">Please signup</h3>
            </div>

            <div class="panel-body">

                <form:form modelAttribute="meterReadForm" role="form">

                    <form:errors/>

                    <div class="form-group">
                        <form:label path="elec">Electricity Read : </form:label>
                        <form:input path="elec" type="elec" class="form-control" placeholder="Enter Electricity Reading"/>
                        <form:errors cssClass="error" path="email"/>
                        <p class="help-block">Enter current Electricity reading.</p>
                    </div>

                    <div class="form-group">
                        <form:label path="gas">Gas Read : </form:label>
                        <form:input path="gas" class="form-control" placeholder="Enter name"/>
                        <form:errors cssClass="error" path="name"/>
                        <p class="help-block">Enter current Gas reading.</p>
                    </div>

                    <button type="submit" class="btn btn-default">Submit</button>

                </form:form>
            </div>

        </div>
    </div>
</div>

<%@include file="includes/footer.jsp" %>